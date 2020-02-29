"use strict"

const publicIp = require('public-ip');
let sleep = require("sleep");
const random = require('random');
const fs = require('fs');
const internetAvailable = require("internet-available");
let unique = require('array-unique');
let delay = require('delay');

exports.internetCheck = async function()
{
	await internetAvailable(
	{
		// Provide maximum execution time for the verification
		timeout: 5000,
		// If it tries 5 times and it fails, then it will throw no internet
		retries: 5
  })
  .then(() =>
  {})
  .catch(() =>
  {
	  console.log("NO internet!");
	  process.exit(-2);
  });
	
}

exports.publicIP = async function()
{
	(async () =>
	{
		console.log("Our public IP is:", await publicIp.v4());
	})();
	
}

exports.randomWaitfor = async function (page, min=900 , max=4000)
{
	let r = random.int(min, max)
	await page.waitFor(r)
}

exports.randomSleep = async function (min=1 , max=6)
{
	let r = random.int(min, max)
	sleep.sleep(r);
}

exports.randomWaitFull = async function (page, min=1 , max=6, pd=1000)
{
	await page.waitFor(pd)
	let r = random.int(min, max)
	sleep.sleep(r)
}

exports.scrol = async function (page)
{
	let res = await page.evaluate(_ =>
	{
		let ranNum = Math.floor((Math.random() * 65) + 10);
		window.scrollBy(0, window.innerHeight + ranNum);
		return document.body.scrollHeight;
	});	
	return res;
}

exports.scrols = async function (page, time)
{
	let resS = [];
	for (let index = 0; index < time; index++)
	{
		let tmp = await exports.scrol(page);
		resS.push(tmp);
		await exports.randomWaitfor(page);
		await exports.randomWaitfor(page);
		await exports.randomWaitFull(page, 10 , 15, 8000);
		let resSLen = resS.length;		
		if(resSLen > 1)
		{
			if( (resS[resSLen-1] - resS[resSLen-2] == 0 ) )
			{
				// console.log('No More Scroll');
				return -2;
			}
		}
	}
}

exports.subList = async function (page, username, subscriptions, subscriptionsBlackList)
{
	try
	{
		console.log('Finding subscribers ...');
		try { await page.goto(`https://www.minds.com/${username}/subscriptions`  , {waitUntil: 'networkidle0'}); }
		catch(error) { console.log('Error subList, could not fully open the page'); }
		await exports.randomWaitfor(page);
		await exports.scrols(page, 40);
		const subNumber = await page.$eval('body > m-app > m-body > m-channel > div.mdl-grid.channel-grid > section.mdl-cell.mdl-cell--8-col > m-channel--subscriptions', el => el.childElementCount );
		console.log(`${subNumber} subscribers.`);
		for (let index = 1; index < subNumber; index++)
		{
			const subName = await page.$eval(`body > m-app > m-body > m-channel > div.mdl-grid.channel-grid > section.mdl-cell.mdl-cell--8-col > m-channel--subscriptions > div:nth-child(${index}) > minds-card-user > a > div.body > h3`, el => el.innerText );
			subscriptions.push(subName);
			let subUsername = await page.$eval(`body > m-app > m-body > m-channel > div.mdl-grid.channel-grid > section.mdl-cell.mdl-cell--8-col > m-channel--subscriptions > div:nth-child(${index}) > minds-card-user > a > div.body > span`, el => el.innerText );			
			if(subUsername != null)
			{
				if(subUsername[0] == '@')
				{
					subscriptions.push(subUsername);
					subUsername = subUsername.slice(1);
				}
			}
			subscriptions.push(subUsername);
			subscriptions.push(subUsername.toLowerCase());
			console.log(subName, subUsername);
		}
		
		for (let i = 0; i < subscriptionsBlackList.length*7; i++)
		{
			let loc = subscriptions.indexOf(subscriptionsBlackList[i]);
			if ( loc != -1)
			{
				subscriptions.splice(loc, 1);
			}
		}
		unique(subscriptions);
		return true;
	}
	catch (error)
	{
		console.log('ERROR SUBS');
		// console.log(error);
		return false;
	}
}

exports.closeSession = async function (page)
{
	try
	{
		console.log('Closing Session ...');
		let sel = `body > m-app > m-v2-topbar > div.m-v2-topbar__Top > div > div.m-v2-topbar__Container--right > div.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > a`;
		await page.click(sel , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		await exports.randomSleep(1,2);
		sel = `body > m-app > m-v2-topbar > div.m-v2-topbar__Top > div > div.m-v2-topbar__Container--right > div.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > ul > li:nth-child(10) > a`;
		await page.click(sel , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		await exports.scrol(page);
		await exports.scrol(page);
		await exports.randomSleep(1,2);
		sel = `body > m-app > m-body > m-settings > div > div > div.m-page--main > m-settings--general > div.m-settings--section.m-border.m-settings--close-all-sessions > button`;
		await page.click(sel , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		return true;
	}
	catch (error)
	{
		console.log('ERROR closeSession');
		// console.log(error);
		return false;
	}
}

exports.closingOtherTabs = async function (browser, page)
{
	let close = true;
	// close = false;
	if(close)
	{
		let brWindows = await browser.pages();
		let i = 0;
		while(brWindows.length > 1)
		{
			// console.log(brWindows[i]._target._targetId);
			if(brWindows[i]._target._targetId != page._target._targetId)
			{
				await delay(1000);
				try { await brWindows[i].close(); }
				catch(error) { console.log("Page close error"); }
				brWindows = await browser.pages();
			}
			else
			{
				i++;
			}
		}
	}
}

exports.closingBrower = async function (browser, page)
{
	let close = true;
	// close = false;
	if(close)
	{
		let brWindows = await browser.pages();
		while(brWindows.length > 0)
		{
			await exports.randomWaitFull(page, 2 , 2, 2000);
			try { await brWindows[0].close(); }
			catch(error) { console.log("Page close error"); }
			brWindows = await browser.pages();
		}
		try { await page.close(); }
		catch(error)
		{
			// console.log("Page close error");
		}
		await exports.randomWaitFull(page, 2 , 2, 2000);
		try { await browser.close(); }
		catch(error)
		{
			console.log("browser close error");
		}
	}
}

exports.goingToMainPage = async function (page)
{
	try
	{
		console.log(`Openning main page`);
		try{ await page.goto('https://www.publish0x.com' , {"waitUntil" : "networkidle0"});
		}catch(error){ console.log('Error loggedInCheck, could not fully open the page'); }
		await exports.randomWaitfor(page);
		await exports.randomWaitFull(page, 2 , 5, 4000);
		return false;
	}
	catch (error)
	{
		// console.log('Error loggedInCheck' , error);
      console.log('Probably not logged in before');
		return false;
	}
}

exports.loggedInCheck = async function (page, username)
{
	try
	{
		console.log(`Checking Login status as ${username} ...`);
		let sel = `#navbarDropdown1`;
		const UN = await page.$eval(sel, el => el.innerText );				
		if (UN.toLowerCase() == username.toLowerCase())
		{
			console.log('Already logged-In');
			return true;
		}
		console.log('Not logged-in');
		return false;
	}
	catch (error)
	{
		// console.log('Error loggedInCheck' , error);
      console.log('Probably not logged in before');
		return false;
	}
}

exports.login = async function (page, email, password)
{
	try
	{
		console.log(`Logging in as ${email} ...`);
		let sel = "#navbarToggle > ul > li:nth-child(1) > a";
		await page.click(sel , {"waitUntil" : "networkidle0"})
		await exports.randomWaitfor(page);
		await exports.randomWaitFull(page, 3 , 7, 7000);
		await page.type('#email' , email , {delay: 50});
		await exports.randomSleep(1,2);
      await page.keyboard.press("Tab");
		await page.type('#password' , password , {delay: 50});
		await exports.randomSleep(1,2);
		await page.click("#login > div:nth-child(4) > div > button" , {"waitUntil" : "networkidle0"})
		await exports.randomWaitfor(page);
		await exports.randomWaitFull(page, 3 , 8, 4000);
		return false;
	}
	catch (error)
	{
		console.log('ERROR LOGIN');
		return true;
	}
}

exports.goingToFeedingPage = async function (page)
{
	try
	{
		console.log('Going to feed page ...');
		await page.goto('https://www.publish0x.com/' , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		await exports.randomWaitFull(page, 3 , 7, 7000);
		await exports.randomWaitFull(page, 2 , 5, 10000);
		return true;
	}
	catch (error)
	{
		console.log('ERROR goingToFeedingPage');
		return false;
	}
}

exports.goingToGooglePage = async function (page)
{
	try
	{
		console.log('Going to Google page ...');
		await page.goto('https://www.google.com/' , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		await delay(2000);
		return true;
	}
	catch (error)
	{
		console.log('ERROR goingToGooglePage' , error);
		return false;
	}
}

exports.goingToPage = async function (page, link)
{
	try
	{
		console.log('Going to page ...');
		await page.goto(link , {"waitUntil" : "networkidle0"});
		await exports.randomWaitfor(page);
		await delay(1000);
		return true;
	}
	catch (error)
	{
		console.log('ERROR goingTo Page' , error);
		return false;
	}
}

exports.getUsersListSync = function ()
{
	let users = [];		
	try
	{
		let userDirPath = './users';
		return fs.readdirSync(userDirPath);		
	}
	catch (error)
	{
		console.log('ERROR getUsersList', error);
		return false;
	}
}