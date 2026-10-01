# Welcome to FitTrack!

## Introduction

Staying consistent with fitness can sometimes be difficult when workouts, activities, and nutrition information are all in different places.

With FitTrack, I wanted to create a simple fitness web application where users can explore workouts, keep track of their activities, and get personalized workout suggestions based on their age.

The application also includes a profile section, activity log, community section, and diet and nutrition references, making it easier for users to keep their fitness-related information in one place.

## How I built it

I used **React** and **TypeScript** as the base of the application, with **Vite** for the development setup.

For the user interface, I used **Tailwind CSS**, along with **Lucide React** for icons and **Motion** for animations.

I also integrated the **Google Gemini API** to add AI-assisted fitness suggestions and personalized workout recommendations. **Express** was used for the server-side part of the application.

## Challenges I ran into

One of the main challenges I faced was bringing all the different parts of the application together while keeping the interface simple and easy to use.

I also had to work with the personalized workout features and make sure that the information provided to users was presented in a clear and useful way.

Another challenge was connecting the frontend with the server-side functionality and the Gemini API while keeping the overall application responsive.

## Accomplishments I'm proud of

I'm proud of bringing different fitness-related features together into one application.

The application can provide personalized workout suggestions based on the user's age, while also allowing users to view their activities and explore fitness, diet, and nutrition-related information.

I also focused on keeping the interface clean and simple so that users can move between the different sections without making the application feel complicated.

## What I learned

While working on FitTrack, I learned more about building a complete web application using React and TypeScript.

I also gained experience working with APIs and connecting frontend components with server-side functionality.

Working with the Gemini API helped me understand how AI-based features can be integrated into a web application to provide more personalized experiences.

I also learned how important it is to keep the user interface simple while adding different features to an application.

## Getting Started

To run FitTrack on your local machine, first install the required dependencies:

### `npm install`

Installs all the packages required to run the project.

### `npm run dev`

Starts the application in development mode.

Open the local URL shown in your terminal to view FitTrack in your browser.

The application will update when changes are made to the code.

### Environment Variables

Some features of FitTrack use the Gemini API. Before running the application, create a `.env.local` file in the project directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
