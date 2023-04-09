# QuixFolio - Portfolio Resume Website Builder

Welcome to QuixFolio! QuixFolio is a website builder that allows you to create your own portfolio resume website quickly and easily. It's perfect for showcasing your work, skills, and achievements in a professional and visually appealing way.

## Getting Started

To use QuixFolio, simply follow these steps:

1. Open https://quixfolio.vercel.app/ in your web browser.
2. Click on the "Login with Github" button to log in to QuixFolio with your Github account.
3. Once you're logged in, you'll see a list of templates to choose from. Click on the "Create Repo" button of the template you want to use.
4. Fill in the information for your new repository, including the repository name and description, and click on "Submit". This will create a new repository on your Github account and host it on Github Pages.
5. You can now use the repository list on the top of the page to update or delete your website as needed, or use the Github repository directly.

## Updating Your Website

To update your website, use the update button for the corresponding repo at the top of your page. For further customisation, simply make changes to the code in your repository and push them to Github. Your changes will be automatically reflected on your website.

## Deleting Your Website

To delete your website, use the delete button for the corresponding repo at the top of your page or simply delete the repository from your Github account. This will also remove your website from Github Pages.

## Support

If you have any questions or issues with QuixFolio, please don't hesitate to create a Github issue in our repository at https://github.com/QuixFolio/quixfolio. We're always here to help!

Thank you for using QuixFolio. We hope you enjoy using our platform to create your own portfolio resume website!4

# Creating your own templates
If you're interested in creating a GitHub template repository that other users can use, we've got you covered with a step-by-step guide.

## `quixfolio.json`

The quixfolio.json file contains the schema of the template you've created. It specifies the properties of the template, their types, default values, and where they should be displayed.

The json contains the following fields:
- "id": a unique identifier for the template
- "name": the name of the template
- "description": a brief description of the template
- "tags": an array of tags associated with the template
- "image": the path to an image file associated with the template
- "schema": an object that describes the fields that can be included in a user's template 

The schema contains fields that the user would fill. Each field contains the following fields:
- type: The data type of the field, such as "string", "integer", "textarea", or "array".
- page: The name of the HTML page on which the field should be displayed.
- default: The default value of the field. The value will be used if no other value is specified.

These are the types that are currently supported.
- string: used for fields that contain text.
- textarea: used for fields that contain a longer amount of text.
- email: used for fields that contain an email address.
- array: used for fields that contain a list of items.
- integer: used for fields that contain an integer number.
- link: used for fields that contain a link to a website.

In addition, items of type "array" have an "items" field that contains an object describing the structure of each item in the array. The objects describing array items have their own set of type, page, and default fields.

## HTML files

The HTML files for the template must follow a specific format. Every field in the schema must have the ID of the element equal to the field specified in the schema. QuixFolio replaces the inner text of the element defined with what the user provides. Links, images, and emails are handled differently.

Arrays are fields where something needs to be repeated multiple times, for example, adding multiple projects. Here, the element that contains the array needs to have the ID corresponding to the field name and contains elements that have multiple children. QuixFolio takes the first child found inside as a template for all items in the array. Each subfield in the array contains a custom attribute corresponding to the items defined in the schema. It should look something like this:
```
<div id="experiences">
  <div>
    <div>
      <h3 title>Senior Web Developer</h3>
      <div company>Company Name</div>
        <p description>Sample desc</p>
    </div>
    <div>
      <span><span startDate>March 2013</span> - <span endDate>Present</span></span>
    </div>
  </div>
</div>
 ```
 
 Where the schema looks like:
 ```
 "experiences": {
    "type": "array",
    "page": "index.html",
    "items": {
      "title": {
        "type": "string",
        "default": ""
      },
      "company": {
        "type": "string",
        "default": ""
      },
      "description": {
        "type": "textarea",
        "default": ""
      },
      "startDate": {
        "type": "string",
        "default": ""
      },
      "endDate": {
        "type": "string",
        "default": ""
      }
    }
  }
```
