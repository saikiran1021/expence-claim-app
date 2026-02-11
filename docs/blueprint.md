# **App Name**: ClaimWise

## Core Features:

- User Authentication: Secure user registration and login using Firebase Authentication.
- Claim Type Selection: Allows users to select either 'Mobile Claims' or 'Broadband Claims' via a dropdown menu.
- Claim Submission Form: Presents a form to users for submitting their expense claim details.
- File Upload: Enables users to upload supporting documents (images, PDFs) to Firebase Storage.
- Claim Amount Validation: Validates the claim amount based on the selected claim type (Mobile: <= 350, Broadband: <= 650).
- Return Amount Calculation: Automatically calculates the reimbursable return amount (83% of the claim amount).
- Claim Storage: Stores the claim data, including user ID, claim details, file URL, and status, in Firestore.

## Style Guidelines:

- Primary color: A serene blue (#64B5F6) to evoke trust and reliability.
- Background color: Light, desaturated blue (#E3F2FD) to ensure readability and a clean aesthetic.
- Accent color: A calming green (#A5D6A7) for positive feedback and confirmations.
- Body and headline font: 'Inter', a sans-serif font, provides a modern, neutral, and readable experience. Note: currently only Google Fonts are supported.
- Use clean, minimalist icons for claim types and actions.
- Responsive design with clear, intuitive form layout.
- Subtle loading animations and smooth transitions to enhance user experience.