import {email, z} from 'zod';

//Define schema fro user registration data;
export const registerSchema = z.object({

    email: z
    .string()
    .email('Invalid email address')          // must look like an email
    .min(1, 'Email is required'), 
    
    password: z
    .string()
    .min(8, 'Password must be at least 8 characters')  // at least 8 characters long
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter') // at least 1 uppercase
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter') // at least 1 lowercase
    .regex(/[0-9]/, 'Password must contain at least one number')           // at least 1 digit
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,                // at least 1 special character
      'Password must contain at least one special character'
    ),

    confirmPassword : z.string().min(1, "Please confirm your password"),
})

//add validation check if password === confirmpassword
//in zod refine use for add extra custom validation
.refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match,",
    path: ['confirmPassword']
})

export const loginSchema = z.object({
    email: z
    .string()
    .email('Invalid email address')
    .min(1, "Email is required"),

    password: z.string().min(1, 'Password is required'),
});

export type  RegisterInput = z.infer<typeof registerSchema>;

export type LoginIput  = z.infer<typeof loginSchema>