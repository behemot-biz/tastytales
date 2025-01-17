# TastyTales: Where each recipe has its own story.

Welcome to **TastyTales**, a vibrant platform where every recipe tells a story and every dish becomes a cherished memory. TastyTales is a community-driven recipe-sharing web application built with a React frontend and a Django REST API backend. It’s designed to connect food enthusiasts, home chefs, and culinary adventurers by offering a space to share, discover, and savour recipes from around the world.

Whether you're looking to showcase your grandmother’s treasured dessert, explore new cuisines, or simply find inspiration for your next meal, **TastyTales** has something for everyone. Users can create and share their own recipes, comment on and like others' creations, and build meaningful connections through the love of food.

Join us in making every recipe a tale worth telling!



[Link - TastyTales React app](https://tastytales-83bed5f61a06.herokuapp.com/)

[Link - TastyTales API](https://tastytales-api-56d55ea68c61.herokuapp.com/)

## Overview

**TastyTales** is a full-stack web application where users can share and explore recipes. It allows users to post their own recipes, browse and search for recipes shared by others, and interact through likes and comments. The platform emphasizes community engagement and creativity, enabling food enthusiasts to showcase their culinary skills.

Key features include:

- Recipe creation and editing.
- Ingredient management.
- Interactive commenting and liking system.
- Profile-based recipe browsing and following.

The application consists of:

1. **Frontend**: Built with React and styled using Bootstrap 4.6 for a modern, responsive design.
2. **Backend**: A Django REST API to handle data management and user interactions.

## UI/UX Design

### Overall Design Approach

The design for **TastyTales** focuses on simplicity and functionality. Inspired by the concept of storytelling, the UI incorporates clean lines and an intuitive layout, ensuring that the focus remains on the recipes and user interactions. The goal is to provide a seamless browsing and sharing experience across devices.

The platform’s visual elements are carefully chosen to evoke a sense of warmth and creativity, while ensuring that all features are easily accessible to both novice and experienced users.

### Fonts

The application uses Google Fonts to create a modern and legible interface:

- **Lora**: A serif font that adds a touch of elegance, used for headings.
- **Open Sans**: A sans-serif font used for body text, ensuring readability across devices.

### Colours

The chosen color palette is designed to reflect creativity and food inspiration. It combines warm tones with neutral accents to create a balanced and inviting visual experience.

#### Colour Scheme



- **Crimson Red (#D72638)**: Used for action buttons and highlights to draw attention.
- **Creamy Beige (#FAF3E0)**: Used as the main background to provide a soft and clean look.
- **Sage Green (#4C956C)**: Used for accents and secondary elements, adding an earthy touch.
- **Neutral Gray (#6D6A75)**: Used for text and subtle details, ensuring readability.

### Imagery

High-quality food photography and illustrations are used throughout the platform to inspire users and visually enhance the storytelling aspect of each recipe. Images are optimized for quick loading without compromising quality.

### Overall Design Approach

By prioritizing a responsive and inclusive design, **TastyTales** ensures that users can enjoy the platform from any device. This approach aligns with the goal of making recipe sharing easy and accessible for everyone.



### Wireframes

Wireframes were created to map out the structure and layout of **TastyTales**. These simple, low-fidelity designs focused on ensuring intuitive navigation and logical content placement, helping to create a seamless user experience.

### Site Goals

The primary goal of **TastyTales** is to provide an engaging platform for food enthusiasts to share and explore recipes. The site aims to foster community interaction through features like commenting, liking, and following profiles. It also emphasizes accessibility and ease of use, ensuring that users can quickly find and contribute content.

### Strategy

The strategic focus of **TastyTales** is on building an engaging, user-driven community centered around recipes and storytelling. By offering features such as detailed profiles, recipe organization, and community interaction, the site ensures users feel connected and valued.

### Scope

**TastyTales** includes features such as recipe creation, ingredient management, profile interactions, and a commenting system. Users can also save recipes as drafts, publish or unpublish them as needed, giving flexibility in managing their content. Future enhancements like recipe bookmarking and advanced search functionality have been planned but are outside the scope of the current release.

### Structure

The site is organized to ensure logical navigation. Users can easily access recipes, manage their profiles, and interact with others through clearly defined sections. The responsive design ensures consistency across devices, from desktops to smartphones.

### Skeleton

The skeletal framework of the site outlines key functional components, such as the recipe feed, profile pages, and detailed recipe views. Each section is designed to be visually distinct yet cohesive within the overall aesthetic of the platform.

### Surface

The visual design of **TastyTales** incorporates warm colors, high-quality images, and clean typography to create an inviting atmosphere. The interface is designed to be intuitive, ensuring users can focus on enjoying and sharing recipes without distractions.

## Agile Development

**TastyTales** was developed using agile methodologies to ensure a structured and iterative process. The project was divided into sprints, with clear goals for each sprint. GitHub Projects was used to organize tasks and manage progress efficiently.

### Kanban Workflow

I employed a **Kanban board** to visualize tasks. This board included the following columns:

- **Backlog**: A repository of tasks and features planned for future sprints.
- **To Do**: Items ready to be worked on in the current sprint.
- **In Progress**: Tasks actively being developed.
- **Test**: Completed tasks awaiting quality assurance.
- **Done**: Tasks that have met all acceptance criteria and are ready for deployment or use.

This workflow ensured that all tasks were organized and progress was transparent.

### User Stories

Each feature or improvement was defined as a user story to emphasize the end-user perspective. User stories included details about functionality, acceptance criteria, and priority levels, ensuring alignment with project goals. [See User Stories in Testing Documentation](testing.md#user-stories).

### Retrospectives

At the end of each sprint, I reflected on successes, challenges, and areas for improvement. This iterative feedback loop helped me continuously enhance both the process and the final product in this solo school project.

## Features

### Header, Navigation - Elements Available on All Pages

text and images 

### Home / Start Page

Published recipes are available to all users, regardless of whether they are logged in or not. Recipes are displayed as cards containing:

- A featured image of the recipe
- A link to the full recipe
- A like button to show appreciation
- Key information like the number of likes and comments etc
- If the user is logged in and have published  recipes, an edit icon is available under the recipe image for quick access

Additionally, the start page highlights **Popular Profiles**—the top 10 most-followed chefs on the platform, listed with the following details:

- An avatar image
- The username of the chef
- A follow/unfollow button for quick interactions



### Add Recipe

The **Add Recipe** page allows users to create or edit recipes with the following features:

- **Recipe Details**:

  - Input fields for the recipe name, introduction, and cooking instructions.
  - A live preview of the recipe image with the option to change it.

- **Edit Ingredients**:

  - Add individual ingredients with measurements, such as quantity and type.
  - Options to edit or delete ingredients from the list.

- **Actions**:

  - Save the recipe or cancel changes with clearly labeled buttons.

This page streamlines the recipe creation process, ensuring users can easily input and manage recipe details and ingredients. Recipes are initially saved as 'Pending Publish,' and users are redirected to the 'My Cookbook' page, where they can choose to publish the recipe.

### My Cookbook

The **My Cookbook** page provides users with a personalized space to manage their recipes. Features include:

- Display of all recipes created by the user, shown as recipe cards with the following elements:

  - A featured image for each recipe
  - The recipe title and brief description
  - A label indicating the recipe's status (e.g., 'Published', 'Pending\_delete')
  - Like and comment counts for quick feedback insights
  - Publish/unpublish options, along with edit and delete icons, for managing each recipe

- Recipes are displayed as organized recipe cards, but filtering or sorting options are not currently implemented.

This page ensures users have full control over their content, providing tools to publish, update, or remove recipes efficiently.



### Recipes - Feed with recipes by followed chefs

Add text describing the feature



### Liked&#x20;

#### --> change to favourites if enough time

Add text describing the feature



### Profile

The **Profile** page allows users to view detailed information about a specific chef, including:

- **Profile Header**:
  - The chef's avatar image, username, and a follow/unfollow button.
  - A quick overview of the number of recipes posted, followers, and users they are following.
  - A short bio or description provided by the user.

- **Recipe Section**:
  - A grid displaying all recipes posted by the chef.
  - Each recipe is displayed as a card containing:
    - A featured image
    - Recipe title and a brief introduction
    - Like and comment counts
    - The date the recipe was posted

- **Top Chefs List**:
  - A sidebar highlighting other top chefs with their avatar images and usernames.
  - Follow/unfollow buttons for quick engagement.

This page provides a comprehensive view of the chef's contributions and makes it easy for users to interact with and explore their recipes.

