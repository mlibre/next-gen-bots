:blush: :robot: Next Generation Bot :robot: :blush:
---
Most **advanced Bot-Army** or web bot for **anything!**. It is the structure of a un detectable working bot. so you will change it for urs.
Also there are sample code in commom.js.
* Undetectable
* Realiable
* Fast & Secure
* Autorun
* Scheduling
* Can use tor out-of-box
* And More

# Requirements
* NodeJs
* Linux Probably

# Installation
~~~bash
# install nodejs, tor, google-chrome, build-essential, make, g++
git clone https://github.com/mlibre/next-gen-bots.git
sudo nano /etc/tor/torrc:
# your file should have lines like this
SocksPort 9050
SocksPort 9051
SocksPort 9052
SocksPort 9053
SocksPort 9054

sudo systemctl enable tor
sudo systemctl restart tor
npm install
sudo npm install pm2 -g
# You also may have to run:
# npm rebuild
nano defaults.json # set botRunChance and runOnStart and other options
# Now you need to define your users. for each user u need to create a folder like users/USERNAME
# And set the user account settings
cd users
# .......
pm2 startup
pm2 start thebot.js --name publish0x
pm2 save
~~~

### Important options
```javascript
"headlessS": false,
"useTor": false
"torRange": [50,50] // tor ports. if you have SocksPort 9050 -> SocksPort 9054 then set this option to [50,54]
```

# Single User/Time run
```bash
node bot.js
```

## Update Extension
~~~bash
cp -r /home/mlibre/.config/chromium/Profile\ 1/Extensions/cnogbbmciffpibmkphohpebghmomaemi/2.0.0.8_0
~~~

## Adblock
Adblock does not work on headless mode (true) now.

Donate
=======
Donate or .... :heartpulse:
ETH:
> 0xc9b64496986E7b6D4A68fDF69eF132A35e91838e

## Auto mount EXT4
Fstab:
UUID=9d0190e1-94a3-4f47-9e75-724fee018a00 /run/media/mlibre/H   ext4    defaults        0       0