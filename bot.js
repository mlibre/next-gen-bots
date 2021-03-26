"use strict";
const random = require("random");
const puppeteer = require("puppeteer");
// const puppeteer = require("puppeteer-extra");
// const pluginStealth = require("puppeteer-extra-plugin-stealth");
const common = require("./common");
const defaults = require("./defaults.json");
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
	{name: "username", alias: "u", type: Number, defaultOption: true},
];
const options = commandLineArgs(optionDefinitions);

let userDataDir = "./chromData/";

if(options.username)
{
	defaults.username = options.username;
	userDataDir = `./users/${options.username}/chromData`;
}
const extPath = "data/AdBlock/2.0.0.8_0/";


async function run()
{
	const args =
		[
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-infobars",
			"--window-position=0,0",
			"--ignore-certifcate-errors",
			"--ignore-certifcate-errors-spki-list",
			`--user-agent=${defaults.userAgent}`,
			"--noerrordialogs",
			"--disable-web-security",
			"--allow-file-access-from-file",
			"--start-maximized"
			// '--disable-features=site-per-process'
			// "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure"
		];
	if(defaults.useTor != false)
	{
		const ra = random.int(defaults.torRange[0], defaults.torRange[1]);
		args.push(`--proxy-server=socks5://127.0.0.1:90${ra}`);
		console.log("Using Tor on" , `90${ra}`);
	}
	if(defaults.useAdBlocker != false)
	{
		args.push(`--disable-extensions-except=${extPath}`);
		args.push(`--load-extension=${extPath}`);
		console.log("Using AdBlock");
	}
	
	const options =
	{
		args,
		// executablePath: "/usr/bin/chromium",
		// executablePath: "/usr/bin/google-chrome-stable",
		// executablePath: "/usr/bin/brave-browser",
		// executablePath: "/usr/bin/brave",
		// slowMo: 50,
		headless: defaults.headlessS,
		ignoreHTTPSErrors: true,
		userDataDir,
		defaultViewport: null,
		appMode: true
	};
	// puppeteer.use(pluginStealth());
	// const preloadFile = fs.readFileSync('./preload.js', 'utf8');
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.evaluateOnNewDocument(require("./preload.js"));
	await page.setDefaultNavigationTimeout(50000);	
	await page.setViewport(defaults.viewport);
	await common.goingToGooglePage(page);
	await common.goingToPage(page,"https://www.detectadblock.com/");
	await common.closingOtherTabs(browser, page);
	await page.screenshot({path: "screenshot.png"});
	await common.closingBrower(browser,page);
}

try
{	
	run();
}
catch (error)
{
	console.log(error);
	process.exit(-2);
}

// Signed-in Google
// Disable webrtc chrome://flags/#disable-webrtc
// Enable Javascript
// Allow Cookies on specific website
// 
// Remove "puppeteer-extra": "latest",
// Remove "puppeteer-extra-plugin-stealth": "latest",
// Use Google-Chrome
// sudo nano /etc/resolv.conf # 8.8.8.8

// Consider copying your own browser cahch in user's brower cache
// sudo cp -r ~/.config/chromium/Profile\ 1/* /run/media/mlibre/H/projects/thebot-next-gen/publish0x/users/thegoodearth/chromData/Default/
// sudo chown -R mlibre /run/media/mlibre/H/projects/thebot-next-gen/publish0x/users/
// chmod a+rwx -R /run/media/mlibre/H/projects/thebot-next-gen/publish0x/users/
// ~/.config/chromium/