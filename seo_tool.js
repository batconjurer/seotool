

$(document).ready(function(){
        
    var hlt_lock=false;
    var init_sty='textarea {margin: 0; border-radius: 0; }\
    .backdrop{overflow: auto;}\
    .highlights{white-space:pre-wrap; word-wrap: break-word;}\
     textarea{#444; background-color:transparent;}\
     .highlights{color:transparent;}\
     mark {color:transparent; background-color:#FFFF00}\
     .backdrop{background-color:#fff}';
        
        $("#srch_txt").on({
        'input':handleInput,
        'scroll':handleScroll
        });
    
    
    function handleInput(){
        var text=document.getElementById('srch_txt').value;
        var highlightedText = applyHighlights(text);
        $highlights.html(highlightedText);
    }
    
    function applyHighlights(text){
        return text
                .replace(/\n$/g,'\n\n')
                .replace(/[A-Z].*?\b/g,'<mark>$&</mark>');
    }
    
    function handleScroll(){
        var scrollTop= document.getElementById('srch_txt').scrollTop;
        $(backdrop).scrollTop(scrollTop);
    }
    
    function reset_forms(){
        if ( confirm('This will reset all forms and delete all text.') ){
        document.getElementById('key_vals').innerHTML='';
        document.getElementById('txt_err').innerHTML='';
        document.getElementById('the_table').innerHTML='';
        document.getElementById('entered_txt').innerHTML='';
        document.getElementById('srch_txt').style.visibility='visible';
        document.getElementById('txt_header').innerHTML='Enter text to be '
         +'searched below.';
        document.getElementById('reset_button').style.visibility='hidden';
        document.getElementById('update_button').style.visibility='hidden';
        document.getElementById('update_txt_button').style.visibility='hidden';
        document.getElementById('submit_button').style.visibility='visible';
        document.getElementById('keywords_form').value='';
        document.getElementById('srch_txt').value='';
        document.getElementById('the_sty').innerHTML=init_sty;
    }
    }
    
    function update_forms(){
        document.getElementById('key_vals').innerHTML='';
        document.getElementById('txt_err').innerHTML='';
        document.getElementById('the_table').innerHTML='';
        document.getElementById('entered_txt').innerHTML='';
        document.getElementById('srch_txt').style.visibility='visible';
        document.getElementById('txt_header').innerHTML='Enter text to be '
         +'searched below.';
        document.getElementById('reset_button').style.visibility='hidden';
        document.getElementById('update_button').style.visibility='hidden';
        document.getElementById('update_txt_button').style.visibility='hidden';
        document.getElementById('submit_button').style.visibility='visible';
        document.getElementById('the_sty').innerHTML=init_sty;
        
    }
    
    function process_form(txt){
        var inpObj=document.getElementById('keywords_form');
        var inpTxt= document.getElementById('srch_txt');
        update_forms();
    
        if(inpObj.checkValidity() == false){
            document.getElementById('key_vals').innerHTML=
                    inpObj.validationMessage;
        } else if(inpTxt.checkValidity()==false){
            document.getElementById('txt_err').innerHTML=
                    "You have not entered any text to be searched.";
        } else{
            do_search(inpObj.value,inpTxt.value);
        
            }   
        } 
    
    function do_search(kwds,srch_txt){
        var kwds=kwds.split(/\r?\n/);
        
        document.getElementById('srch_txt').style.visibility='hidden';
        document.getElementById('reset_button').style.visibility='visible';
        document.getElementById('update_button').style.visibility='visible';
        document.getElementById('update_txt_button').style.visibility='visible';
        document.getElementById('submit_button').style.visibility='hidden';
        document.getElementById('txt_header').innerHTML='Entered text.';
        document.getElementById('entered_txt').innerHTML='<div style="white-space: pre-wrap;">'+srch_txt+'</div>';
        
        document.getElementById('the_sty').innerHTML=
                'table,th, td {border: 1px solid black;}';
        document.getElementById('the_sty').innerHTML+='th,td {padding: 15px;}';
        document.getElementById('the_table').innerHTML+='<tr><th> Kewyord'+
         '</th><th>Number of Occurrences </th><th> In first 100 words\? </th></tr>';
        for (i=0; i<kwds.length;i++){
            document.getElementById('the_table').innerHTML+=
                    prepare_string(kwds[i],i,srch_txt);
                    document.getElementById(kwds[i]).style.color="black";
        }
        /*for (i=0; i<kwds.lenght;i++){
            document.getElementById(kwds[i].toString).onclick="highlight(this.id)";
        }*/    
        
        
        
    }
    
    String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    function search_all(kwd,str){
        var i=0;
        var str_indices=[];
        var re=new RegExp(kwd,"i");
        while (i<str.length && str.regexIndexOf(re,i)!=-1){
            str_indices.push(str.regexIndexOf(re,i));
            i=str.regexIndexOf(re,i)+1;
        }
        
        return str_indices;
    }
    
    
    
    function prepare_string(kwd,i,str){
        var str_indices=search_all(kwd,str);
        var otpt='<tr><td><button id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="var_hghlght(\''+kwd+
                '\')" onmouseout="var2_hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+search_all(kwd,str).length+'</td><td>'
               +'&#10005'+'</td></tr>';
        for (i=0;i<str_indices.length;i++){
            if(str_indices[i]<100){
                otpt='<tr><td><button id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="var_hghlght(\''+kwd
                +'\')" onmouseout="var2_hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+search_all(kwd,str).length+'</td><td>'
               +'&#10003'+'</td></tr>';
            }
            }
        return otpt;
    }
    
    String.prototype.indexReplace=function(to_rep,i,j){
        return this.slice(0,i)+to_rep+this.slice(j,);
    }
    
    function unhghlght(txt){
        var re=new RegExp('<span style="background-color: #FFFF00">',"g");
        var re2=new RegExp('<span style="background-color: #FFFF00">',"g");
        txt=txt.replace(re,'');
        txt=txt.replace(re2,'');
        document.getElementById('entered_txt').innerHTML=txt;
        hlt_lock=false;
    }
    
    function highlight(kwd){
        var butt=document.getElementById(kwd);
        var txt=document.getElementById('entered_txt').innerHTML;
        var indices=search_all(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        
        if(butt.style.color=="blue"){
            if (hlt_lock==true){
                unhghlght(txt);
                for (i=0;i<indices.length;i++){
                var to_rep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
                txt=txt.indexReplace(to_rep,indices[i],indices[i]+kwd.length);
                document.getElementById('entered_txt').innerHTML=txt;
                
            }
        }
            butt.style.color="red";
            hlt_lock=true;
        
        } else if (butt.style.color=="red") {
            unhghlght(txt);
            butt.style.color="black";
        }
    }

    function var_hghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=document.getElementById('entered_txt').innerHTML;
        var indices=search_all(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if( butt.style.color=="black" && hlt_lock==false){
            for (i=0;i<indices.length;i++){
            var to_rep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
            txt=txt.indexReplace(to_rep,indices[i],indices[i]+kwd.length);
            document.getElementById('entered_txt').innerHTML=txt;
            butt.style.color="blue";
        }
        }
    }
        
    function var2_hghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=document.getElementById('entered_txt').innerHTML;
        
        if (butt.style.color=="blue") {
            unhghlght(txt);
            butt.style.color="black";
        }
    }
    });