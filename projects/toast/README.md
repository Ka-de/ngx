# Toast #

## Introduction ##
This is a library used to manage notifications in form of Toast/Snackbar in Angular. The progress of the actions that triggered the notification is also monitored by the library.

## Tools ##
This library depends alot on the following tools
- RxJs
- uuid
- fontawesome


## Component Inputs ##
<details>
    <summary>nVisible</summary>
    <span>This is the max number of visible notifications at a particular instance</span>
</details>
<details>
    <summary>timeout</summary>
    <span>This is the duration that a visible toast will stay on the screen if it is not sticky</span>
</details>

## Functions ##
<details>
    <summary>Add</summary>
    <span>
        This is used to add a now toast to the System
    </span>
</details>
<details>
    <summary>Update</summary>
    <span>
        This is used to update a particular toast in the system
    </span>
</details>
<details>
    <summary>Remove</summary>
    <span>
        This is used to remove a particular toast from the system
    </span>
</details>
<details>
    <summary>Toasts</summary>
    <span>
        This is the Observable triggered on any of the above actions. Gets the list of the toasts in the system
    </span>
</details>