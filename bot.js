"use strict"
const random = require('random');
const puppeteer = require('puppeteer');
// const puppeteer = require("puppeteer-extra");
// const pluginStealth = require("puppeteer-extra-plugin-stealth");
let common = require('./common');
let defaults = require('./defaults.json');


let userAgent = defaults.userAgent;
let extPath = "data/AdBlock/2.0.0.8_0/";

function preload()
{
	// Object.defineProperty(navigator, "languages",
	// {
	// 	get: function () {
	// 		return ["en-US", "en"];
	// 	},
	// });
	// Object.defineProperty(navigator, 'webdriver',
	// {
	// 	get: () => false,
	// });
	delete navigator.__proto__.webdriver;
	delete navigator.__proto__.webdriver;
	delete navigator.webdriver;
	window.navigator.chrome =
	{
		"app":
		{
			"isInstalled":false,
			"InstallState":
			{
				"DISABLED":"disabled",
				"INSTALLED":"installed","NOT_INSTALLED":"not_installed"
			},
			"RunningState":
			{
				"CANNOT_RUN":"cannot_run","READY_TO_RUN":"ready_to_run","RUNNING":"running"
			}
		},
		"runtime":
		{
			"OnInstalledReason":
			{
				"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"
			},
			"OnRestartRequiredReason":
			{
				"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"
			},
			"PlatformArch":
			{
				"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"
			},
			"PlatformNaclArch":
			{
				"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"
			},
			"PlatformOs":
			{
				"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"
			},
			"RequestUpdateCheckStatus":
			{
				"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"
			}
		}
	};
	window.navigator.languages = ["en-US", "en"];
}

async function run()
{
	let args =
	[
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-infobars',
		'--window-position=0,0',
		'--ignore-certifcate-errors',
		'--ignore-certifcate-errors-spki-list',
		`--user-agent=${userAgent}`
	];
	if(defaults.useTor != false)
	{
		let ra = random.int(defaults.torRange[0], defaults.torRange[1]);
		args.push(`--proxy-server=socks5://127.0.0.1:90${ra}`);
		console.log('Using Tor on' , `90${ra}`);
	}
	if(defaults.useAdBlocker != false)
	{
		args.push(`--disable-extensions-except=${extPath}`);
		args.push(`--load-extension=${extPath}`);
		console.log('Using AdBlock');
	}
	
	const options =
	{
		args,
		// executablePath: "/usr/bin/chromium",
		executablePath: "/usr/bin/google-chrome-stable",
		// executablePath: "/usr/bin/brave-browser",
		// executablePath: "/usr/bin/brave",
		headless: defaults.headlessS,
		ignoreHTTPSErrors: true,
		userDataDir: `./chromData/`
	};
	// puppeteer.use(pluginStealth());
	// const preloadFile = fs.readFileSync('./preload.js', 'utf8');
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.evaluateOnNewDocument(preload);
	await page.setDefaultNavigationTimeout(50000);	
	await page.setViewport(defaults.viewport);
	await common.goingToGooglePage(page);
	await common.goingToPage(page,'https://www.detectadblock.com/');
	await common.closingOtherTabs(browser, page);
	await page.screenshot({path: 'screenshot.png'});
	await common.closingBrower(browser,page)
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

// Add preloadFile
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