let puppeteer=require("puppeteer");
let fs=require("fs");
let cfile=process.argv[2];
let celeb=process.argv[3];
let nPost=process.argv[4];


(async function(){

    let data=await fs.promises.readFile(cfile);
    let {url,user,pwd} = JSON.parse(data);
    let browser =await puppeteer.launch({
        headless:false,
        slowMo:30,
        defaultViewport:null,
        args:["--start-maximized"],

    });
    let tabs=await browser.pages();
    let tab=tabs[0];
    await tab.goto(url,{waitUntil:"networkidle2"});
    await tab.waitForSelector("input[name=username]");
    await tab.type("input[name=username]",user);
    await tab.type("input[name=password]",pwd);
    await tab.click("button[type=submit]");
    await tab.waitForNavigation({waitUntil:"networkidle2"});
    await tab.waitForSelector(".mt3GC",{visible:true});
    await tab.click(".bIiDR");
    await tab.type("input[placeholder=Search]",celeb);
    await tab.waitForSelector(".yCE8d");
    let manageLinks=await tab.$$(".drKGC .yCE8d");
    let href = await tab.evaluate(function (el) {
        return el.getAttribute("href");
      }, manageLinks[0]);
    
      let myUrl="https://www.instagram.com"+href;
    await tab.goto(myUrl,{waitUntil:"networkidle2"});    
    
    await likePic(tab);


})();
async function likePic(tab){
    let i=0
    try{
        
        do{

        

        
         await tab.waitForSelector("article > div:nth-child(1) img[decoding=auto]");
         let ele=await tab.$$("article > div:nth-child(1) img[decoding=auto]");
         let pics=ele[i];
         await pics.click({delay:100});
         
         let label=await tab.waitForSelector("svg[aria-label=Like]");
         
         await tab.click("svg[aria-label=Like]",{delay:150});
         await tab.click(".coreSpriteRightPaginationArrow",{delay:150});
         console.log(i)
         i++;
        
        }while(i<nPost);
        
    }
    catch(err){
        console.log(err);
    }
}

