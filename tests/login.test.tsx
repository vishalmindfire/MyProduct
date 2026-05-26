import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import type { ReactNode } from 'react'
import LoginForm from '@/app/components/LoginForm'


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

const SUCCESS_RESPONSE = { ok: true, error: undefined, status: 200, url: null, code: undefined }
const FAILURE_RESPONSE = { ok: false, error: 'CredentialsSignin', status: 401, url: null, code: 'credentials' }


function setup() {
  const user = userEvent.setup()
  render(<LoginForm />)
  return {
    user,
    emailInput:    () => screen.getByPlaceholderText('you@example.com'),
    passwordInput: () => screen.getByPlaceholderText('••••••••'),
    submitButton:  () => screen.getByRole('button', { name: /sign in/i }),
  }
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  email = 'user@test.com',
  password = 'password123'
) {
  await user.type(screen.getByPlaceholderText('you@example.com'), email)
  await user.type(screen.getByPlaceholderText('••••••••'), password)
  await user.click(screen.getByRole('button', { name: /sign in/i }))
}


describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('shows the welcome heading', () => {
      setup()
      expect(screen.getByText('Welcome back')).toBeInTheDocument()
    })

    it('renders email and password inputs', () => {
      const { emailInput, passwordInput } = setup()
      expect(emailInput()).toBeInTheDocument()
      expect(passwordInput()).toBeInTheDocument()
    })

    it('renders a submit button labelled "Sign in"', () => {
      const { submitButton } = setup()
      expect(submitButton()).toBeInTheDocument()
    })

    it('does not show an error message on initial render', () => {
      setup()
      expect(screen.queryByText('Invalid email or password.')).not.toBeInTheDocument()
    })

    it('email input has type="email"', () => {
      const { emailInput } = setup()
      expect(emailInput()).toHaveAttribute('type', 'email')
    })

    it('password input has type="password"', () => {
      const { passwordInput } = setup()
      expect(passwordInput()).toHaveAttribute('type', 'password')
    })

    it('both inputs are required', () => {
      const { emailInput, passwordInput } = setup()
      expect(emailInput()).toBeRequired()
      expect(passwordInput()).toBeRequired()
    })
  })

  describe('successful sign-in', () => {
    beforeEach(() => {
      mockSignIn.mockResolvedValue(SUCCESS_RESPONSE)
    })

    it('calls signIn with the credentials provider and form values', async () => {
      const { user } = setup()
      await fillAndSubmit(user, 'user@test.com', 'secret123')

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'user@test.com',
          password: 'secret123',
          redirect: false,
        })
      })
    })

    it('redirects to /dashboard on success', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('does not show an error message on success', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(screen.queryByText('Invalid email or password.')).not.toBeInTheDocument()
      })
    })
  })

  describe('failed sign-in', () => {
    beforeEach(() => {
      mockSignIn.mockResolvedValue(FAILURE_RESPONSE)
    })

    it('shows an error message on invalid credentials', async () => {
      const { user } = setup()
      await fillAndSubmit(user, 'wrong@test.com', 'badpassword')

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
      })
    })

    it('does not redirect on failure', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() => {
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('clears the error on the next submission attempt', async () => {
      mockSignIn
        .mockResolvedValueOnce(FAILURE_RESPONSE)
        .mockResolvedValueOnce(SUCCESS_RESPONSE)

      const { user } = setup()
      await fillAndSubmit(user)

      await waitFor(() =>
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
      )

      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() =>
        expect(screen.queryByText('Invalid email or password.')).not.toBeInTheDocument()
      )
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      mockSignIn.mockImplementation(() => new Promise(() => {}))
    })

    it('disables the submit button while pending', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })

    it('changes the button label to "Signing in…" while pending', async () => {
      const { user } = setup()
      await fillAndSubmit(user)

      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
    })
  })
})
