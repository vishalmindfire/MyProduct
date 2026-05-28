import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import type { ReactNode } from 'react'
import RegisterForm from '@/app/components/RegisterForm'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockSignIn = jest.mocked(signIn)
const mockFetch = jest.fn()
global.fetch = mockFetch

const SIGN_IN_SUCCESS = { ok: true, error: undefined, status: 200, url: null, code: undefined }
const SIGN_IN_FAILURE = { ok: false, error: 'CredentialsSignin', status: 401, url: null, code: 'credentials' }

function apiOk() {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 201,
    json: () => Promise.resolve({ user: { id: 1, username: 'testuser', email: 'test@example.com' } }),
  })
}

function apiFail(error = 'Email already taken', status = 400) {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  })
}

function apiNetworkError() {
  mockFetch.mockRejectedValue(new Error('Failed to fetch'))
}

const DEFAULTS = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  confirm: 'password123',
}

function setup() {
  const user = userEvent.setup()
  render(<RegisterForm />)
  return { user }
}

async function fill(
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<typeof DEFAULTS> = {},
) {
  const { username, email, password, confirm } = { ...DEFAULTS, ...values }
  if (username) await user.type(screen.getByLabelText('Username'), username)
  if (email)    await user.type(screen.getByLabelText('Email'), email)
  if (password) await user.type(screen.getByLabelText('Password'), password)
  if (confirm)  await user.type(screen.getByLabelText('Confirm password'), confirm)
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<typeof DEFAULTS> = {},
) {
  await fill(user, values)
  await user.click(screen.getByRole('button', { name: /create account/i }))
}

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('shows the "Create your account" heading', () => {
      setup()
      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    })

    it('renders all four input fields', () => {
      setup()
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
    })

    it('renders the submit button labelled "Create account"', () => {
      setup()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('renders a "Sign in" link pointing to /login', () => {
      setup()
      expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    })

    it('email input has type="email"', () => {
      setup()
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    })

    it('both password inputs start as type="password"', () => {
      setup()
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
      expect(screen.getByLabelText('Confirm password')).toHaveAttribute('type', 'password')
    })

    it('shows no validation errors on initial render', () => {
      setup()
      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/must be/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/do not match/i)).not.toBeInTheDocument()
    })
  })

  describe('client-side validation', () => {
    it('shows an error when username is empty', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { username: '' })
      expect(await screen.findByText('Username is required.')).toBeInTheDocument()
    })

    it('shows an error when username is shorter than 3 characters', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { username: 'ab' })
      expect(await screen.findByText('Username must be at least 3 characters.')).toBeInTheDocument()
    })

    it('shows an error for an invalid email address', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { email: 'not-an-email' })
      expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    })

    it('shows an error when password is shorter than 8 characters', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { password: 'short', confirm: 'short' })
      expect(await screen.findByText('Password must be at least 8 characters.')).toBeInTheDocument()
    })

    it('shows an error when the confirm field is empty', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { confirm: '' })
      expect(await screen.findByText('Please confirm your password.')).toBeInTheDocument()
    })

    it('shows an error when passwords do not match', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { password: 'password123', confirm: 'different9' })
      expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument()
    })

    it('does not call fetch when validation fails', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { username: 'ab' })
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('clears a field error when the user starts typing in that field', async () => {
      const { user } = setup()
      await fillAndSubmit(user, { username: 'ab' })

      expect(await screen.findByText('Username must be at least 3 characters.')).toBeInTheDocument()

      await user.type(screen.getByLabelText('Username'), 'c')

      await waitFor(() => {
        expect(screen.queryByText('Username must be at least 3 characters.')).not.toBeInTheDocument()
      })
    })
  })

  describe('successful registration', () => {
    beforeEach(() => {
      apiOk()
      mockSignIn.mockResolvedValue(SIGN_IN_SUCCESS)
    })

    it('calls POST /api/register with trimmed, lowercased values', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/register',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              username: 'testuser',
              email: 'test@example.com',
              password: 'password123',
            }),
          }),
        )
      })
    })

    it('shows the success banner after the API responds', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(await screen.findByText(/account created/i)).toBeInTheDocument()
    })

    it('calls signIn with the credentials provider after registration', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: false,
        })
      })
    })

    it('redirects to /dashboard when sign-in succeeds', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('sign-in failure after registration', () => {
    beforeEach(() => {
      apiOk()
      mockSignIn.mockResolvedValue(SIGN_IN_FAILURE)
    })

    it('redirects to /login?registered=1 when sign-in fails', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?registered=1')
      })
    })

    it('does not redirect to /dashboard when sign-in fails', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).not.toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('API registration error', () => {
    beforeEach(() => {
      apiFail()
    })

    it('shows a fallback error message when the API returns an error', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(await screen.findByText('Registration failed. Please try again.')).toBeInTheDocument()
    })

    it('does not call signIn when registration fails', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockSignIn).not.toHaveBeenCalled()
      })
    })

    it('does not redirect when registration fails', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('clears the server error when the user types in any field', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(await screen.findByText('Registration failed. Please try again.')).toBeInTheDocument()

      await user.type(screen.getByLabelText('Username'), 'x')

      await waitFor(() => {
        expect(screen.queryByText('Registration failed. Please try again.')).not.toBeInTheDocument()
      })
    })
  })

  describe('network error', () => {
    beforeEach(() => {
      apiNetworkError()
    })

    it('shows a network error message when fetch throws', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(await screen.findByText('A network error occurred. Please try again.')).toBeInTheDocument()
    })

    it('does not call signIn on a network error', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockSignIn).not.toHaveBeenCalled()
      })
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() => new Promise(() => {}))
    })

    it('changes the button label to "Creating account…" while pending', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument()
    })

    it('disables the submit button while the request is pending', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
    })
  })

  describe('password visibility toggle', () => {
    it('clicking the toggle reveals the password', async () => {
      const { user } = setup()
      const [toggleBtn] = screen.getAllByRole('button', { name: /show password/i })

      await user.click(toggleBtn)

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    })

    it('clicking the toggle again hides the password', async () => {
      const { user } = setup()
      const [toggleBtn] = screen.getAllByRole('button', { name: /show password/i })

      await user.click(toggleBtn)
      await user.click(screen.getAllByRole('button', { name: /hide password/i })[0])

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })

    it('toggling the confirm field does not affect the password field', async () => {
      const { user } = setup()
      const [, confirmToggle] = screen.getAllByRole('button', { name: /show password/i })

      await user.click(confirmToggle)

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
      expect(screen.getByLabelText('Confirm password')).toHaveAttribute('type', 'text')
    })
  })
})