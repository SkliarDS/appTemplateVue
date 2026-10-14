import { YANDEX_METRIKA_ID } from "@/utils/constans";

export function sendMetrik(event, goal) {
	if (window.ym) {
		window.ym(YANDEX_METRIKA_ID, event, goal);
		// console.log('goal:',goal);
	} else {
		console.warn("Яндекс.Метрика не загружена.");
	}
}

export function sendAdriver(goal) {
    if (typeof AdriverCounterJS === 'undefined') {
        console.warn('AdriverCounterJS not loaded');
        return;
    }
    
    window.adrCounterStorage = window.adrCounterStorage || []; 
    window.adrCounterStorage.push(function() {
        new AdriverCounterJS({
            sid: 230164, 
            bt: 62, 
            sz: goal
        }, {
            id: "",
            gid1: "",
            yid1: ""
        });
    });
	
}

export function initYandexMetrika() {

	(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script',`https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`, 'ym');

    ym(YANDEX_METRIKA_ID, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
	
}

export function trackPixel(pixelId) {
	if (typeof __GetI === "undefined") {
		window.__GetI = [];
	}
	(function () {
		const p = {
			type: pixelId === "registration" ? "CONVERSION" : "VIEW",
			site_id: "10109", // 10109
			order: [],
			transaction_id: "",
			revenue: "",
			pixel_id: pixelId,
		};
		window.__GetI.push(p);
		const domain = typeof window.__GetI_domain === "undefined" ? "px.adhigh.net" : window.__GetI_domain;
		const src = (document.location.protocol === "https:" ? "https://" : "http://") + domain + "/t.js";
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src;
		const s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(script, s);
	})();
	console.log("trackPixel() pixelId:", pixelId);
}


export function adsHeadsCheck() {
	let img = document.createElement("img");
	img.src = `https://ads-heads.ru/c/rl.gif?label=RLlflHBO&ttl={TTL}&rid=289052093`;
	img.width = 1;
	img.height = 1;
	img.style.display = "none";
	document.body.appendChild(img);
}
export function adsHeadsRegistration() {
	let img = document.createElement("img");
	img.src = `https://ads-heads.ru/c/rl.gif?label=RL52NL0z&ttl={TTL}&rid=68477918`;
	img.width = 1;
	img.height = 1;
	img.style.display = "none";
	document.body.appendChild(img);
}
