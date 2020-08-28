## [5.5.4](https://github.com/Nigecat/Plexi/compare/v5.5.3...v5.5.4) (2020-08-28)


### Bug Fixes

* beepboop and aroundtheworld commands not being hidden ([5adb169](https://github.com/Nigecat/Plexi/commit/5adb169e520ab4c6f7650b815d642d10664848f1))
* client user caching issue ([776b5b4](https://github.com/Nigecat/Plexi/commit/776b5b42d22434f4ee3f6ca54125b03c3156c53b))
* improper use of gateway intents ([9eba15e](https://github.com/Nigecat/Plexi/commit/9eba15ee49a0367fdf65b41d447ad27b0737de29))
* process not terminating cleanly ([29788b9](https://github.com/Nigecat/Plexi/commit/29788b962eaabd09335579a44ba1ea7a4742a984))
* shutdown command erroring and not disconnecting from database ([616fa9c](https://github.com/Nigecat/Plexi/commit/616fa9cb2628feaa3b89e7ee862d666deb43faa6))


### Features

* **command:** around the world ([4ec9976](https://github.com/Nigecat/Plexi/commit/4ec9976d6dbe9074011aca16a0a7f8457495fb61))
* **command:** bite comamnd ([58e704f](https://github.com/Nigecat/Plexi/commit/58e704fcd61b1ef2a30cf89594b6196402aa7e1b))
* **command:** boop command ([8c49314](https://github.com/Nigecat/Plexi/commit/8c49314e75536c6198bc0b673079f43ea6387a05))
* **command:** chainable reload command for debugging ([6e61d81](https://github.com/Nigecat/Plexi/commit/6e61d81471404fdf4fc43eff742894b2099543a0))
* **command:** confused command ([9db9b94](https://github.com/Nigecat/Plexi/commit/9db9b94171715a86addb9e8ba9e5fb438dfc83ba))
* **command:** cry command ([0161a47](https://github.com/Nigecat/Plexi/commit/0161a479a84d97fd7e5ba94424d2ee09dd58b53c))
* **command:** cuddle command ([30a2de6](https://github.com/Nigecat/Plexi/commit/30a2de6ccda4ac1c0da87485fe7f676eff64ab9d))
* **command:** dance command ([3725d4f](https://github.com/Nigecat/Plexi/commit/3725d4f93537d7093b22b3d2fb59140b68630eeb))
* **command:** happy command ([76e6c21](https://github.com/Nigecat/Plexi/commit/76e6c2110809f34f975c972604415b45288be481))
* **command:** kiss command ([b74ad58](https://github.com/Nigecat/Plexi/commit/b74ad587ad5b29b328ae38234381385c1299d06d))
* **command:** lewd command ([2273ff8](https://github.com/Nigecat/Plexi/commit/2273ff89ea77403a736ffdc20440624515209229))
* **command:** lewd command ([042cb93](https://github.com/Nigecat/Plexi/commit/042cb935e28e7142a9c09fb8114f9d307abdd642))
* **command:** lick command ([97fcf7d](https://github.com/Nigecat/Plexi/commit/97fcf7ddf0bb3aba803639d1620f75868d40ab8f))
* **command:** pat command ([2fac258](https://github.com/Nigecat/Plexi/commit/2fac2587f236abf678c7330043bd60430b5a80c7))
* **command:** poke command ([4de8289](https://github.com/Nigecat/Plexi/commit/4de8289b1c6db04559e01047c6a908a2e2cd22ee))
* **command:** pout and run commands ([fb0489f](https://github.com/Nigecat/Plexi/commit/fb0489f8f9d5d2fbe4ff6a3f469e556a6b4b89a5))
* **command:** punch command ([9004095](https://github.com/Nigecat/Plexi/commit/9004095ab0519d554138be215b4fa525d5efc86b))
* **command:** scared command ([4c4134d](https://github.com/Nigecat/Plexi/commit/4c4134db5aa5c243b25cb1a030f9c47f5fb2e66f))
* **command:** shocked command ([3a20289](https://github.com/Nigecat/Plexi/commit/3a202894fe066076e4e19c2c112b358b4b1bf360))
* **command:** slap command ([59aec45](https://github.com/Nigecat/Plexi/commit/59aec455cf00b4b1b0d9bb947b5b4a098fcaca07))
* **command:** smile command ([0aebfa3](https://github.com/Nigecat/Plexi/commit/0aebfa39aec8d357104ea769dc0bc12b10584e2f))
* **command:** smug command ([5c8c63e](https://github.com/Nigecat/Plexi/commit/5c8c63e46a115e2df35cd1e9591c6beb7e87cd90))
* **command:** surprised command ([24f0106](https://github.com/Nigecat/Plexi/commit/24f0106849fe7fed37a0c33a5661bc64e9a1a17a))
* **command:** waving command ([3ebb822](https://github.com/Nigecat/Plexi/commit/3ebb8221f8301d71a8099de364c4f6ffcf60d073))
* generic self reaction command handler ([5425ce7](https://github.com/Nigecat/Plexi/commit/5425ce705c981bbf7526c3d5b44c9c58108a866e))
* **command:** tickle command ([e648c06](https://github.com/Nigecat/Plexi/commit/e648c06d04b0c1c812e9ca3c116680672be68f9f))
* generic reaction command handler ([dbb6f4a](https://github.com/Nigecat/Plexi/commit/dbb6f4a46f9f2df959884a1adb3bc61e3ffc9786))
* math command for solving equations ([be2d80a](https://github.com/Nigecat/Plexi/commit/be2d80a26a45d00b1d390779b2a29466d42e7cfd))


### Performance Improvements

* reduce docker image layers ([56d2bdc](https://github.com/Nigecat/Plexi/commit/56d2bdc637aeed61874ac730a195d3390f83e6ed))
* remove need for storing images as temporary files ([66b8803](https://github.com/Nigecat/Plexi/commit/66b880325e91b14ebec5734594107ff3449044b8))


### Reverts

* remove support invite from help ([a3a9e90](https://github.com/Nigecat/Plexi/commit/a3a9e903ce4433e8e00c5e782ae61453b308428d))



## [5.5.3](https://github.com/Nigecat/Plexi/compare/v5.5.2...v5.5.3) (2020-08-21)


### Bug Fixes

* add urban dictionary source disclaimer ([a58f89e](https://github.com/Nigecat/Plexi/commit/a58f89e9627474242c453a5564a3ca129a4e1195))
* null guild owner bug ([ba85860](https://github.com/Nigecat/Plexi/commit/ba858606c11007763af04e74849a8ae8a4289c2f))
* stat command user count ([1be5461](https://github.com/Nigecat/Plexi/commit/1be54616aa20b2fdd9411096446e62f3b4ea59f2))


### Features

* **command:** boombox command ([07a727f](https://github.com/Nigecat/Plexi/commit/07a727f0d3ef0205d371e033c97a6beeec216f25))
* **command:** debug command to chain multiple commands together ([79aa938](https://github.com/Nigecat/Plexi/commit/79aa9388cd5a25e118eed8f8f698dbe729cc6853))
* **command:** joke command to get a random joke ([4f34ca9](https://github.com/Nigecat/Plexi/commit/4f34ca9fe5e70a9f23f80d7704ed56c9f92a0d73))
* **commant:** debug command for checking owner distribution ([a12590e](https://github.com/Nigecat/Plexi/commit/a12590e3ad66c81a5723658ff807e0f5b41a4471))



## [5.5.2](https://github.com/Nigecat/Plexi/compare/v5.5.1...v5.5.2) (2020-08-19)


### Bug Fixes

* duel bet confirm reaction allowing anyone to react ([d1ec09c](https://github.com/Nigecat/Plexi/commit/d1ec09cf8cb312b36e0d3db0f596885f8aac97f1))
* duel command not properly unlocking user accounts ([53cf967](https://github.com/Nigecat/Plexi/commit/53cf96752d3eb68070f03a035e675ee4eb55edcc))
* duel end condition ([1a6dd05](https://github.com/Nigecat/Plexi/commit/1a6dd0574a8557f813b629c8e732f51811d90550))
* duel turn toggling ([58019c9](https://github.com/Nigecat/Plexi/commit/58019c9cd7602b9d76027afd6460a0e5e8081363))
* incorrect duel card check target ([c8abf21](https://github.com/Nigecat/Plexi/commit/c8abf219e1db3ba7b7e0772e3db790e360c14b70))
* infinite coin bug ([da502a2](https://github.com/Nigecat/Plexi/commit/da502a2d9afeb5c58c678728599c25bbbdc9d299))
* mycards bug ([41bea2d](https://github.com/Nigecat/Plexi/commit/41bea2d5154210fa800d0747aa6b58b4a62474d0))
* mycards bug ([524ab2f](https://github.com/Nigecat/Plexi/commit/524ab2fba15d2ebcd0c9f8a12471f28bc2a350b0))
* premature duel auto passing ([94a748b](https://github.com/Nigecat/Plexi/commit/94a748b83a8fe478ec978a51d27492232dab3173))
* several catrd duel bugs ([52a2db6](https://github.com/Nigecat/Plexi/commit/52a2db611cc590574c66d193fe0eacb4d675bd4c))



## [5.5.1](https://github.com/Nigecat/Plexi/compare/v5.5.0...v5.5.1) (2020-08-19)


### Bug Fixes

* extremely large decks not display properly ([d49a912](https://github.com/Nigecat/Plexi/commit/d49a912cca0cc2da06d44489a72f82c36552e41e))
* extremely large decks not display properly ([775bc60](https://github.com/Nigecat/Plexi/commit/775bc60b35f9a8a55f6d972c05707af5c4524d61))
* rps subtraction ([2b0b4da](https://github.com/Nigecat/Plexi/commit/2b0b4dae5417f824814566da83e59bef35df139c))
* rps weighting ([7e1bb3e](https://github.com/Nigecat/Plexi/commit/7e1bb3eadf6ad4aca26a7c33d085da26757339ca))



# [5.5.0](https://github.com/Nigecat/Plexi/compare/v5.4.7...v5.5.0) (2020-08-19)


### Bug Fixes

* card image uploads not working with non jpgs ([6356c79](https://github.com/Nigecat/Plexi/commit/6356c7957457c6fd9de30dad415b104af576d1ab))
* cards were case-sensitive ([9fd1935](https://github.com/Nigecat/Plexi/commit/9fd19356c6da7c074525266ddcccffa11ec67a1e))
* change dotenv to be preloaded ([#86](https://github.com/Nigecat/Plexi/issues/86)) ([a53c1ac](https://github.com/Nigecat/Plexi/commit/a53c1ac87776fcce9094b6fcf4f9b489f8b1c96f))
* command oneOf property is now case-insensitive ([098a84d](https://github.com/Nigecat/Plexi/commit/098a84d5bbc97e3419abea82f4923088eddc12c1))
* duel command not properly calculating power ([14105d8](https://github.com/Nigecat/Plexi/commit/14105d8a0d52e1a10051732a3dbf5a1c50971fc2))
* duel hand not getting deleted after duel finishes ([8773f97](https://github.com/Nigecat/Plexi/commit/8773f977dbb479c01639996b6b928e69ba2e6edd))
* typo ([a8d9802](https://github.com/Nigecat/Plexi/commit/a8d980261c44dc643976d5eab97c53f6eab0ad39))
* users being able to change their data while in a duel ([5e5a3da](https://github.com/Nigecat/Plexi/commit/5e5a3daca01308cff7ce93b199816e4053741588))
* users could change their data during a duel to break things ([5b570e5](https://github.com/Nigecat/Plexi/commit/5b570e5b138659e657452fe15f527b28fd16f582))


### Features

* **command:** add buypack command ([9067c09](https://github.com/Nigecat/Plexi/commit/9067c0950dd6124564b6031befa1eb9edf40b626))
* **command:** add cardinfo command ([192403d](https://github.com/Nigecat/Plexi/commit/192403dcf01bbf70291c87cc9b1abf17a13ea3aa))
* **command:** add catrd pack info command ([2d27870](https://github.com/Nigecat/Plexi/commit/2d2787089785ee0703455cfc86302b261661cdb0))
* **command:** add command to check your cards and deck ([2cea028](https://github.com/Nigecat/Plexi/commit/2cea0283e64240fbd376dd835a61a8712d821c4d))
* **command:** add commands to add and remove cards from the deck ([d5aa40c](https://github.com/Nigecat/Plexi/commit/d5aa40c987ac512cac3254c2134ebb88bdb6d998))
* **command:** create mycards command ([b1cc605](https://github.com/Nigecat/Plexi/commit/b1cc60538f675c149f42e970a2c310d8950190cc))
* **command:** daily coin claim ([90f5599](https://github.com/Nigecat/Plexi/commit/90f5599fd6eb17e6a57571066d68bc49934e6084))
* **command:** duel command ([#88](https://github.com/Nigecat/Plexi/issues/88)) ([f6c70d2](https://github.com/Nigecat/Plexi/commit/f6c70d2e3d00a4017409c823dc47c34bda288054))
* **command:** help command for catrd ([b496030](https://github.com/Nigecat/Plexi/commit/b4960308bff2ae0fd45aaaee4a084c3cfdb625e1))
* **command:** rock paper scissors command to gain coins ([9810753](https://github.com/Nigecat/Plexi/commit/9810753cef75b01932c5455ad6ca131c0f07da1b))
* **command:** sellcard command to sell cards ([7cb5d7d](https://github.com/Nigecat/Plexi/commit/7cb5d7d0b6c8f902ac2b302d7df5e2a086f861b5))
* **command:** topcoins command to check the global leaderboard for coins ([e7c6a2c](https://github.com/Nigecat/Plexi/commit/e7c6a2c72293cd3113483813e9b1cfa2d2396308))
* add card manager system ([a962b70](https://github.com/Nigecat/Plexi/commit/a962b7074e749a42c19e14be599b62d5db620709))


### Performance Improvements

* remove useless class inheritance ([d53c7b6](https://github.com/Nigecat/Plexi/commit/d53c7b68cc6572bbcde42a95a9d8751dc983c7ad))



## [5.4.7](https://github.com/Nigecat/Plexi/compare/5ca864a4f8e4dcd28bf7f4468608172171306fbf...v5.4.7) (2020-08-17)


### Bug Fixes

* explorer breaking with spaces in names ([5ca864a](https://github.com/Nigecat/Plexi/commit/5ca864a4f8e4dcd28bf7f4468608172171306fbf))
* message formatting ([ca1bfc2](https://github.com/Nigecat/Plexi/commit/ca1bfc237c1e32a2e086318b1f2a22df77d6a244))
* remove useless purge double check ([68cf9d9](https://github.com/Nigecat/Plexi/commit/68cf9d938e6626d1d91652f121ddaae809c065f6))
* typescript refusing to build on ubuntu ([f8f0424](https://github.com/Nigecat/Plexi/commit/f8f0424cca8909a612c0e13da3d9750f7542bed4))
* typo ([33a8ded](https://github.com/Nigecat/Plexi/commit/33a8ded696270ca95d3c812ef39dd8e25bb43ee7))
* user command spacing issue ([ac92f74](https://github.com/Nigecat/Plexi/commit/ac92f744a9f7b18cf1348d4d12823839ca6a1c12))


### Features

* **command:** add command to ban users not in the server ([#71](https://github.com/Nigecat/Plexi/issues/71)) ([6c59693](https://github.com/Nigecat/Plexi/commit/6c59693c09d2219e8a359e83e3b87dc5f65718bf))
* **command:** add command to clear guild data ([3208514](https://github.com/Nigecat/Plexi/commit/320851421109c2925b20529ca927c317db410002))
* **command:** add command to clear personal user data ([9ce016c](https://github.com/Nigecat/Plexi/commit/9ce016cf08b1ecdd869b72c9e1f8349f71661d46))
* **command:** add shrimp and tableslam commands ([478b1e3](https://github.com/Nigecat/Plexi/commit/478b1e31c22e25ba1f4ba0a5507ecf30c3b24e62))
* **command:** add slowmode command ([#69](https://github.com/Nigecat/Plexi/issues/69)) ([c9a02c8](https://github.com/Nigecat/Plexi/commit/c9a02c89926ecd7c8967ccb7fcf2e20ebc4a19ef))
* economy system ([#66](https://github.com/Nigecat/Plexi/issues/66)) ([32ce2f9](https://github.com/Nigecat/Plexi/commit/32ce2f919af7ed9bb3272d9a6d3f7cabf94a7b9a))


### Performance Improvements

* remove tmp-promise dependency ([#72](https://github.com/Nigecat/Plexi/issues/72)) ([cbbc3d3](https://github.com/Nigecat/Plexi/commit/cbbc3d32e34364d7418bd91970d1688276265438))
* remove unnecessary await ([933b182](https://github.com/Nigecat/Plexi/commit/933b1829ed102fa7f3d000c0f69b019813819311))


### Reverts

* Revert "ci: fix build attempting to run on gh-pages branch (#74)" (#75) ([86b51b5](https://github.com/Nigecat/Plexi/commit/86b51b50b1020425d7024d309b951a754df21e7d)), closes [#74](https://github.com/Nigecat/Plexi/issues/74) [#75](https://github.com/Nigecat/Plexi/issues/75)
* remove jekyll theme ([3b95613](https://github.com/Nigecat/Plexi/commit/3b956139a9e3e8b3578db27940a33a4f4d43449c))



