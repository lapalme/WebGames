import { setSVGfactors } from "./SVGtools.js";

export {setLang,buildProblemSelection,initLanguageHandlers}

let lang,otherLang;

function setLang(lng){
    lang = lng;
    otherLang = lang=="en"?"fr":"en";
    // show elements with the lang and hide one in otherLang
    $(`[lang=${lang}]`).show();
    $(`[lang=${otherLang}]`).hide();
    if ($("#explanation").is(":visible")){
        $(`#show-${lang}-expl`).hide();
    } else {
        $(`#hide-${lang}-expl`).hide();
    }
    $("title",$("#reset")).text(lang=="fr"?"Recommencer ce jeu":"Restart this game");
    $("title",$("#undo")).text(lang=="fr"?"Annuler le dernier coup":"Undo last move");
}

function buildProblemSelection(levels,keys){
    const $levels = $("#levels");
    for (const {en,fr} of levels){
        $levels.append(
            `<tr id='${en}'><td><span lang="en">${en}</span> <span lang="fr">${fr}</span></td></tr>`
        ) 
    }
    for (const key of keys){
        for (const {en,fr,from,to} of levels){
            if (from <= key && key <= to){
                $("#"+en).append(`<td><label for="c${key}">${key}</label><br/><input name="state-no" type="radio" value="${key}" id="c${key}"></td>`)
            }
        }
    }
    $("input[name=state-no]:first").prop("checked",true); // check first state
}


function initLanguageHandlers(){
    $("#explanation").load("./Explanation.html",
                           ()=>$("[lang=en]").hide())
    $("input[name=lang]").change(e=>setLang($(e.target).val()));
    $("#hide-show-explanation").click(function(){
        $("#explanation").toggle();
        if ($("#explanation").is(":visible")){
            $(`#show-${lang}-expl`).hide();
            $(`#hide-${lang}-expl`).show();
        } else {
            $(`#show-${lang}-expl`).show();
            $(`#hide-${lang}-expl`).hide();
        }
    });
    $(window).on("resize",setSVGfactors)
 }

