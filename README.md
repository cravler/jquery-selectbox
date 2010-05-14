# jQuery SelectBox

A major problem with `<select>` inputs is that they do not allow you to apply
styles. jQuery SelectBox aims to fix this by converting
select elements into a dropdown menu which acts as a proxy to select element.

## Usage

Obviously you will need [jQuery](http://jquery.com/) and the jQuery SelectBox plugin.
Add them to your web page:

    <script type="text/javascript" src="/js/jquery.js"></script>
    <script type="text/javascript" src="/js/jquery.selectbox.js"></script>

You will also need to add the CSS file to make things look right:

    <link rel="stylesheet" href="/css/selectbox.css" type="text/css" media="screen" />

Next you will need to replace a the select element:

    $(document).ready(function()
    {
        $('select').selectbox();
    });
