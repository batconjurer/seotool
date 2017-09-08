// This file belongs to the project "Jeju SEO Tool" which was released under the GPL 3.0 license
// See https://github.com/batconjurer/Jeju-SEO-Tool/blob/master/LICENSE for full license details.

/*var initSty='textarea {margin: 0; border-radius: 0; color:#333333; background-color:transparent; }\
    .backdrop{overflow: auto;}\
    .highlights{white-space:pre-wrap; word-wrap: break-word;}\
     .highlights{color:transparent;}\
     mark {color:transparent; background-color:#FFFF00}\
     .backdrop{background-color:#FFFFFF}';*/
var hltLock={keyword:false, hundred:false};
var initSty='';
var preText='<div style="white-space: pre-wrap;">';
var subText='</div>';



//Text box functions 

function updateForms(){
        $('#keyVals').html("");
        $('#txtErr').html('');
        $('#theTable').html('');
        $('#enteredTxt').html('');
        $('#srchTxt').show();
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#findHundred').hide();
        $('#inst1').show();
        $('#inst2').hide();
        $('#theSty').html(initSty);
        hltLock.hundred=false;
        hltLock.keyword=false;
        
        
    }
    
    function processForm(txt){
        var inpObj=document.getElementById('keywordsForm');
        var inpTxt= document.getElementById('srchTxt');
        updateForms();
    
        if(inpObj.checkValidity() == false){
            $('#keyVals').html(inpObj.validationMessage);
        } else if(inpTxt.checkValidity()==false){
            $('#txtErr').html("<span style='color:red;background-color:yellow;'>"+
                    "You have not entered any text to be searched.</span>");
        } else{
            doSearch(inpObj.value,inpTxt.value);
        
            }   
        } 
 
    //General helper functions
    
  
    String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    
    String.prototype.indexReplace=function(toRep,i,j){
        return this.slice(0,i)+toRep+this.slice(j,);
    }
    
    function wordPlacement(kwd,str){
      var strIndex=Math.min.apply(null,searchAll(kwd,str));
      if (searchAll(kwd,str)==[]){
          return strIndex;
      }
      str=str.slice(0,strIndex);
      return str.match(/[^a-zA-Z0-9'-@_]\b/g)==null ? 0: str.match(/[^a-zA-Z0-9'-@_]\b/g).length;
    }
    
    function searchAll(kwd,str){
        var i=0;
        var strIndices=[];
        var re=new RegExp(kwd,"i");
        while (i<str.length && str.regexIndexOf(re,i)>=0){
            strIndices.push(str.regexIndexOf(re,i));
            i=str.regexIndexOf(re,i)+1;
        }
        
        return strIndices;
    }
    
    function removeAll(array,item){
        var newArray=[];
        for(i=0;i<array.length;i++){
            if(array[i]!=item){
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
   
    
    //Main logic functions
    
    
    function doSearch(kwds,srchTxt){
        var kwds=kwds.replace(/\r?\n/g,',');
        kwds=kwds.split(',');
        
        
        for(i=0; i<kwds.length;i++){
            kwds[i]=kwds[i].trim();
        }
        
        kwds=removeAll(kwds,'');
        
        for(i=0; i<kwds.length; i++){
            kwds[i]=$('<div>').text(kwds[i]).html();
        }
        if (kwds.length>20){
          $('#keyVals').html('You have entered more than 20 search terms. Using only the'
          +' first 20.');
          }
        kwds=kwds.slice(0,20);
        var safeTxt=$('<div>').text(srchTxt).html();
        
        $('#srchTxt').hide();
        $('#resetButton').show();
        $('#updateButton').show();
        $('#updateTxtButton').show();
        $('#submitButton').hide();
        $('#inst1').hide();
        $('#inst2').show();
        $('#txtHeader').html('Entered text.');
        $('#enteredTxt').html(preText+safeTxt+subText);
        $('#findHundred').show();
        $('#theSty').append('table,th, td {border: 1px solid black;}');
        $('#theSty').append('th,td {padding: 15px;}');
        $('#theTable').append('<tr><th> Kewyord'+
         '</th><th>Number of Occurrences </th><th> In first 100 words\? </th></tr>');
        for (i=0; i<kwds.length;i++){
            $('#theTable').append(prepareString(kwds[i],i,srchTxt));
                    document.getElementById(kwds[i]).style.color="black";
        }
             
    }
    
    
    function prepareString(kwd,i,str){
        i++;
        var strIndices=searchAll(kwd,str);
        var otpt='<tr><td>'+i+'&nbsp <button type="button" id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="varHghlght(\''+kwd+
                '\')" onmouseout="var2Hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+searchAll(kwd,str).length+'</td><td>'
               +'&#10005'+'</td></tr>';
        
            if(wordPlacement(kwd,str)<100){
                otpt='<tr><td>'+i+'&nbsp <button type="button" id="'+kwd+'" onclick="highlight(\''+kwd+'\')"'
                +'onmouseover="varHghlght(\''+kwd
                +'\')" onmouseout="var2Hghlght(\''+kwd+'\')">'
                +kwd+'</button></td><td>'+searchAll(kwd,str).length+'</td><td>'
               +'&#10003'+'</td></tr>';
            }
        
        return otpt;
    }
    
    
    
    //Word Highlighting Functionality
    
     function unhghlght(txt){
        var re=new RegExp('<span style="background-color: #FFFF00">',"g");
        var re2=new RegExp('</span>',"g");
        var re3=new RegExp('<span style="background-color: red">',"g");
        txt=txt.replace(re,'');
        txt=txt.replace(re2,'');
        txt=txt.replace(re3,'');
        $('#enteredTxt').html(txt);
        hltLock.keyword=false;
    }
    
    
    
    function highlight(kwd){
        var butt=document.getElementById(kwd);
        
        unhghlght($('#enteredTxt').html());
    
        if(hltLock.hundred==true){
            hltLock.hundred=false;
            hltHundred();
        }
        
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if(butt.style.color=="blue" || butt.style.color=="black"){
            
        for (i=0;i<indices.length;i++){
                    var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
                    txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
                }
            $('#enteredTxt').html(txt);
            $(":button").css("color","black");
            butt.style.color="red";
            hltLock.keyword=kwd;

        } else if (butt.style.color=='red'){
            butt.style.color="black";
        }
    }
        
    function varHghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        var indices=searchAll(kwd,txt).sort(function(a, b){return a - b});
        indices=indices.reverse();
        
        if( butt.style.color=="black" && hltLock.keyword==false){
            for (i=0;i<indices.length;i++){
            var toRep='<span style="background-color: #FFFF00">'
                       +txt.slice(indices[i],indices[i]+kwd.length)+'</span>';
            txt=txt.indexReplace(toRep,indices[i],indices[i]+kwd.length);
            
            }
        $('#enteredTxt').html(txt);
        butt.style.color="blue";
        }
    }
        
    function var2Hghlght(kwd){
        var butt=document.getElementById(kwd);
        var txt=$('#enteredTxt').html();
        
        if (butt.style.color=="blue") {
            unhghlght(txt);
            butt.style.color="black";
            if(hltLock.hundred==true){
            hltLock.hundred=false;
            hltHundred();
            }
        }
    }
    
    
    function hltHundred(){
      if(hltLock.hundred==true){
        var tempAttr=hltLock.keyword;
        unhghlght($('#enteredTxt').html());
        hltLock.hundred=false;
        
        if (tempAttr!=false){
        document.getElementById(tempAttr).style.color="blue";
        highlight(tempAttr);
        }
    } else {
          
        var re=/[^a-zA-Z0-9'-_A@]\b/g;
        var tempAttr=hltLock.keyword;
        unhghlght($('#enteredTxt').html());
        var str=$('#enteredTxt').html();
        str=str.slice(preText.length,-subText.length);
      
        var indices=[];
        var i=0;
      
        while((match=re.exec(str))!=null && i<=100){
            indices.push(match.index);
            i++;
        }
     
      
      
        if(100<=indices.length){
            if(indices[100]){
            str=str.indexReplace('</span>',indices[100],indices[100]);
            str=str.indexReplace('<span style="background-color: red">',indices[99]+1,indices[99]+1);
            $('#enteredTxt').html(preText+str+subText);
            } else {
                str=str.append('</span>');
                str=str.indexReplace('<span style="background-color: red">',indices[99]+1,indices[99]+1);
                $('#enteredTxt').html(preText+str+subText);
            }
        
        }
        hltLock.hundred=true;
    
        if (tempAttr!=false){
            document.getElementById(tempAttr).style.color="blue";
            highlight(tempAttr);
        }
        }
    }
        
    
    
    
 //jQuery logic
    
$(document).ready(function(){
       
    
    $('#resetButton').click(function(){
        if ( confirm('This will reset all forms and delete all text.') ){
        $('#keyVals').html('');
        $('#txtErr').html('');
        $('#theTable').html('');
        $('#enteredTxt').html('');
        $('#findHundred').hide();
        $('#srchTxt').show();
        $('#txtHeader').html('Enter text to be searched below.');
        $('#resetButton').hide();
        $('#updateButton').hide();
        $('#updateTxtButton').hide();
        $('#submitButton').show();
        $('#keywordsForm').value='';
        $('#srchTxt').val('');
        $('#theSty').html(initSty);
        $('#inst1').show();
        $('#inst2').hide();
        hltLock.hundred=false;
        hltLock.keyword=false;
    }
    });
    
   
    
    //Miscellaneous Button logic
    
    $('#updateButton').click(function() {
        processForm();
    });
    
    $('#submitButton').click(function() {
        processForm();
        $('html,body').scrollTop(0);
    });
    
    $('#updateTxtButton').click(function(){
        updateForms();
    });
    
    $('#findHundred').click(function() {
        hltHundred();
    });
    
    });
    