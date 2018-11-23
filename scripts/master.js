//emmet start
emmet.require('textarea').setup({
    pretty_break: true, // enable formatted line breaks (when inserting
    // between opening and closing tag)
    use_tab: true // expand abbreviations by Tab key
});

//emmet end

//open html tab
$("#defaultOpen").click();

//on page load 
$(function () {
    //if there is prior code that was made, import it 
    if (localStorage["page_source"]) {
        $("#HTMLeditor").val(localStorage["page_source"])
    }
    if (localStorage["script_source"]) {
        $("#JSeditor").val(localStorage["script_source"])

    }
    if (localStorage["style_source"]) {
        $("#CSSeditor").val(localStorage["style_source"])
    }

})


var reader = new FileReader();
var xmlhttp = new XMLHttpRequest();

var wrapper = new Vue({
    el: "#container",
    data: {

    },
    methods: {

        //    shift click tab feature  
        activate: function (event, tab, textArea) {


            if (event.shiftKey) {
                function x(tab) {

                    var textAreas = document.getElementsByClassName('codeArea');
                    document.getElementById('commands').className = "slimMenu";

                    for (i = 0; i < textAreas.length; i++) {
                        if (document.querySelectorAll('.on').length == 3) {
                            textAreas[i].className = textAreas[i].className.replace(" spanFour", " spanTwo");
                            textAreas[i].className = textAreas[i].className.replace(" spanThree", " spanTwo");

                        } else if (document.querySelectorAll('.on').length == 2) {
                            textAreas[i].className = textAreas[i].className.replace(" spanFour", " spanThree");

                        }
                    }
                }
                openMultiTab(event, textArea);
                x(tab);


            } else {
                openTab(event, textArea);
            }


        },
        tab: function (box) {
            document.getElementById(box).innerHTML = document.getElementById(box).innerHTML + "    ";
        }


    },
    computed: {

    }
})

function update(elementID, code) {
    document.getElementById(elementID).innerHTML = code;
}

function openMultiTab(evt, name) {
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className = evt.currentTarget.className.replace(" off", " on");
}

//changing active langugae 
function openTab(evt, name) {

    document.getElementById('commands').className = "normalMenu";

    var tabcontent = document.getElementsByClassName("tabcontent");

    //pull the 3 textarea's, make the width full, since only one is selected, then hide all
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" spanTwo", " spanFour");
        tabcontent[i].className = tabcontent[i].className.replace(" spanThree", " spanFour");
        tabcontent[i].style.display = "none";
    }
    //pull the tab objects
    var tablinks = document.getElementsByClassName("languageTab");
    //turn them all off
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" on", " off");
    }
    //show the active code area
    document.getElementById(name).style.display = "block";

    //change the current tabs style
    evt.currentTarget.className = evt.currentTarget.className.replace(" off", " on");

}

var myWindow

//built in libraries 
var jquery = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'

//live code view function
function liveCode() {
    var html = $("#HTMLeditor").val();
    var css = $("#CSSeditor").val();
    var js = $("#JSeditor").val();

    try {
        myWindow.close();
    } catch (e) {

    }

    myWindow = window.open("", "MsgWindow", "width=1100,height=600");

    var doc = `${jquery}\n <style> ${css} </style> \n ${html} \n <script> ${js} </script>`

    myWindow.document.write(doc);

    return doc;
}

//prep inline css call 
function prepLine() {
    var html = $("#HTMLeditor").val();
    var css = $("#CSSeditor").val();
    css = "<style>" + css + "</style>"

    var doc = css + html;

    return doc;
}


var minify = require('html-minifier').minify;

//emmet options 
var options = {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    decodeEntities: true,
    html5: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: false,
    removeEmptyElements: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
}

//find what text is selected
function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    console.log(text)
    return text;
}

//caching
function cache() {
    localStorage['page_source'] = $("#HTMLeditor").val()
    localStorage['script_source'] = $("#JSeditor").val()
    localStorage['style_source'] = $("#CSSeditor").val()
}


var priorCopy = ""
var copy = ""

//keyboard shortcuts 
$(function () {

    $("body").keydown(function (event) {
        //        console.log(event.which)

        //cache the code when it is modified
        cache();
        //copy
        if (event.ctrlKey && event.which == 67) {
            priorCopy = copy
            copy = getSelectionText()
        }
        //paste prior copy
        if (event.ctrlKey && event.altKey && event.which == 86) {

        }
        //live preview
        if (event.ctrlKey && event.which == 76) {
            liveCode();
        }
        //inline css
        if (event.ctrlKey && event.which == 73) {
            $("#HTMLeditor").val(doInline(prepLine()))
        }
        //beautify
        if (event.ctrlKey && event.which == 66) {
            //html
            $("#HTMLeditor").val(html_beautify($("#HTMLeditor").val()))
            //css
            $("#CSSeditor").val(css_beautify($("#CSSeditor").val()))
            //js
            $("#JSeditor").val(js_beautify($("#JSeditor").val()))
        }
        //html minify
        if (event.ctrlKey && event.which == 77) {
            //mini html
            $("#HTMLeditor").val(minify($("#HTMLeditor").val(), options))
            //mini css
            $("#CSSeditor").val(minify($("#CSSeditor").val(), options))
            //mini js 
            $("#JSeditor").val(minify($("#JSeditor").val(), options))


        }
        //mega encrypter  
        if (event.altKey && event.shiftKey && event.ctrlKey && event.which == 69) {
            //decode html
            $("#HTMLeditor").val(Encrypt($("#HTMLeditor").val(), true))
            //decode css
            $("#CSSeditor").val(Encrypt($("#CSSeditor").val(), true))
            //decode js
            $("#JSeditor").val(Encrypt($("#JSeditor").val(), true))
        }
        //decrypter 
        else if (event.shiftKey && event.ctrlKey && event.which == 69) {
            //decode html
            $("#HTMLeditor").val(Decrypt($("#HTMLeditor").val()))
            //decode css
            $("#CSSeditor").val(Decrypt($("#CSSeditor").val()))
            //decode js
            $("#JSeditor").val(Decrypt($("#JSeditor").val()))
        }
        //encrypter
        else if (event.ctrlKey && event.which == 69) {
            //encode html
            $("#HTMLeditor").val(Encrypt($("#HTMLeditor").val(), false))
            //encode css
            $("#CSSeditor").val(Encrypt($("#CSSeditor").val(), false))
            //encode js
            $("#JSeditor").val(Encrypt($("#JSeditor").val(), false))
        }

    })

})

//insert function 
function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

//checkboxes

var librarys = {
    jquery: "https://code.jquery.com/jquery-3.3.1.min.js",
    vue: "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js",
    angular: "http://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js",
    react: "https://unpkg.com/react@16/umd/react.development.js",
    backbone: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js",
    bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    w3: "https://www.w3schools.com/w3css/4/w3.css",
    pure: "https://unpkg.com/purecss@1.0.0/build/pure-min.css",
    skeleton: "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
    uikit: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-rc.23/css/uikit.min.css"
}

function import_(library, type) {

    if (type == "js") {
        var link = '<script src="' + librarys[library] + '"></script>'
    } else if (type == "css") {
        var link = '<link rel="stylesheet" type="text/css" href="' + librarys[library] + '">'
    }

    var index = $("#HTMLeditor").val().search("<head>") + 6
    //if theres a <head>
    if (index > 6) {
        $("#HTMLeditor").val(insert($("#HTMLeditor").val(), index, link))

    } else {
        console.log(link + $("#HTMLeditor").val())
        $("#HTMLeditor").val(link + $("#HTMLeditor").val())
    }
    //make dom look nice 
    $("#HTMLeditor").val(html_beautify($("#HTMLeditor").val()))



}

function remove_(library, type) {
    if (type == "js") {
        var link = '<script src="' + librarys[library] + '"></script>'
    } else if (type == "css") {
        var link = '<link rel="stylesheet" type="text/css" href="' + librarys[library] + '">'
    }

    $("#HTMLeditor").val($("#HTMLeditor").val().replace(link + "\n", ""))
}


//icon hover effect 

$("#icon").hover(function () {
    $("#icon_ball").css("fill", "orange");
    $("#icon_tail").css("fill", "#ff5353");

}, function() {
    $("#icon_ball").css("fill", "black");
    $("#icon_tail").css("fill", "black");
})


//library switches

//javascript

//jquery
$("#check_jquery").change(function () {
    if ($("#check_jquery").is(':checked'))
        import_("jquery", "js")
    else
        remove_("jquery", "js")

})

//vue
$("#check_vue").change(function () {
    if ($("#check_vue").is(':checked'))
        import_("vue", "js")
    else
        remove_("vue", "js")

})

//angular
$("#check_angular").change(function () {
    if ($("#check_angular").is(':checked'))
        import_("angular", "js")
    else
        remove_("angular", "js")

})

//react
$("#check_react").change(function () {
    if ($("#check_react").is(':checked'))
        import_("react", "js")
    else
        remove_("react", "js")

})

//backbone
$("#check_backbone").change(function () {
    if ($("#check_backbone").is(':checked'))
        import_("backbone", "js")
    else
        remove_("backbone", "js")

})

//css

//w3
$("#check_w3").change(function () {
    if ($("#check_w3").is(':checked'))
        import_("w3", "css")
    else
        remove_("w3", "css")
})

//bootstrap
$("#check_bootstrap").change(function () {
    if ($("#check_bootstrap").is(':checked'))
        import_("bootstrap", "css")
    else
        remove_("bootstrap", "css")
})

//pure
$("#check_pure").change(function () {
    if ($("#check_pure").is(':checked'))
        import_("pure", "css")
    else
        remove_("pure", "css")
})

//skeleton
$("#check_skeleton").change(function () {
    if ($("#check_skeleton").is(':checked'))
        import_("skeleton", "css")
    else
        remove_("skeleton", "css")
})

//uikit
$("#check_uikit").change(function () {
    if ($("#check_uikit").is(':checked'))
        import_("uikit", "css")
    else
        remove_("uikit", "css")
})




//code styles

$("#theme_nightLight").click(function () {
    $("textarea").css("background", "#001d30");
    $(".commandItem").css("background", "#001d30")
    $("textarea").css("color", "#ecc242");
    $("body").css("background-color", "#00304c")
})

$("#theme_dayNight").click(function () {
    $("textarea").css("background", "black");
    $(".commandItem").css("background", "black")
    $("textarea").css("color", "white");
    $("body").css("background-color", "#7a7b7a")
})

$("#theme_hacker").click(function () {
    $("textarea").css("background", "black");
    //    $("textarea").css("font-family", "'Press Start 2P'");
    $(".commandItem").css("background", "black")
    $("textarea").css("color", "#4dff4a");
    $("body").css("background-color", "black")
})

$("#theme_plum").click(function () {
    $("textarea").css("background", "#591952");
    $(".commandItem").css("background", "#591952")
    $("textarea").css("color", "#9f5596");
    $("body").css("background-color", "#4d1647")
})

$("#theme_velvet").click(function () {
    $("textarea").css("background", "#fff0db");
    $(".commandItem").css("background", "#fff0db")
    $("textarea").css("color", "#d4302b");
    $("body").css("background-color", "#ffe3bb")
})

$("#theme_mist").click(function () {
    $("textarea").css("background", "#242424");
    $(".commandItem").css("background", "#242424")
    $("textarea").css("color", "#10508c");
    $("body").css("background-color", "#1e1e1e")
})

$("#theme_loveNote").click(function () {
    $("textarea").css("background", "#a1c3d1");
    $(".commandItem").css("background", "#a1c3d1")
    $("textarea").css("color", "#e64398");
    $("body").css("background-color", "#b39bc8")
})

$("#theme_ribbon").click(function () {
    $("textarea").css("background", "#1e1e1e");
    $(".commandItem").css("background", "#1e1e1e")
    $("textarea").css("color", "red");
    $("body").css("background-color", "black")
})