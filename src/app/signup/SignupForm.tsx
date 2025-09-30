'use client';

import {
  Form,
  FormRow,
  FormInput,
  FormButtons,
  TextField,
  PasswordField,
  SubmitButton,
  Icon,
} from 'react-basics';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApi, useMessages } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import Logo from '@/assets/logo.svg';
import styles from './SignupForm.module.css';

export function SignupForm() {
  const { formatMessage, labels, getMessage } = useMessages();
  const router = useRouter();
  const { post, useMutation } = useApi();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (data: any) => post('/auth/signup', data),
  });

  const handleSubmit = async (data: any) => {
    mutate(data, {
      onSuccess: async (result) => {
        // Redirect to setup page with email parameter
        router.push(`/setup?email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  return (
    <div className={styles.signup}>
      <Icon className={styles.icon} size="xl">
        <Logo />
      </Icon>
      <div className={styles.title}>Sign up for Oravo</div>
      <Form className={styles.form} onSubmit={handleSubmit} error={getMessage(error)}>
        <FormRow label="Name">
          <FormInput
            data-test="input-name"
            name="name"
            rules={{ 
              required: formatMessage(labels.required),
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            }}
          >
            <TextField autoComplete="name" />
          </FormInput>
        </FormRow>
        <FormRow label="Email Address">
          <FormInput
            data-test="input-email"
            name="email"
            rules={{ 
              required: formatMessage(labels.required),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            }}
          >
            <TextField type="email" autoComplete="email" />
          </FormInput>
        </FormRow>
        <FormRow label={formatMessage(labels.username)}>
          <FormInput
            data-test="input-username"
            name="username"
            rules={{ 
              required: formatMessage(labels.required),
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            }}
          >
            <TextField autoComplete="username" />
          </FormInput>
        </FormRow>
        <FormRow label={formatMessage(labels.password)}>
          <FormInput
            data-test="input-password"
            name="password"
            rules={{ 
              required: formatMessage(labels.required),
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
          >
            <PasswordField autoComplete="new-password" />
          </FormInput>
        </FormRow>
        <FormRow label="Confirm Password">
          <FormInput
            data-test="input-confirm-password"
            name="confirmPassword"
            rules={{ 
              required: formatMessage(labels.required),
              validate: (value: string, formValues: any) => 
                value === formValues.password || 'Passwords do not match'
            }}
          >
            <PasswordField autoComplete="new-password" />
          </FormInput>
        </FormRow>
        <FormButtons>
          <SubmitButton
            data-test="button-submit"
            className={styles.button}
            variant="primary"
            disabled={isPending}
          >
            Sign Up
          </SubmitButton>
        </FormButtons>
      </Form>
      <div className={styles.loginLink}>
        Already have an account? <Link href="/login">Login here</Link>
      </div>
    </div>
  );
}

export default SignupForm;