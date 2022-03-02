// const expect = require("chai").expect
// const {mobileBtn} = require("../../../src/functions/domFunctions")
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// describe.only('', () => {
//     const dom = new JSDOM(` <div class="toggle-btn">
//                                 <span class="bar"></span>
//                                 <span class="bar"></span>
//                                 <span class="bar"></span>
//                             </div>
//                             <div class="nav-links></div>
//                             <div class="nav-links></div>`);
    
//     it('Kattintásnál összes linkhez active class-t kell adnia - mobileBtn()', () => {
//        let btn = dom.window.document.querySelector(".toggle-btn")
//        let navlinks = dom.window.document.querySelectorAll(".nav-links")

//        mobileBtn(btn, navlinks)
//        btn.dispatchEvent(new dom.window.Event('click'))

//        navlinks.forEach(link => { expect(link.classList.contains("active")).to.be.false})
//     });
// });