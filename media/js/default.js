//footer  quote
function random(len){
  return Math.floor(Math.random()*len)
}
function fromstr(str){
  return str.split('').map(function(e){
    var hex = e.charCodeAt(0).toString(16);
    return hex.length<=4? (new Array(5-hex.length)).join('0')+hex: hex
  }).join('');
}
function frombq(str){
  var arr = str.match(/.{1,4}/g)
  return arr.map(function(e){
    return String.fromCodePoint(`0x${e}`);
  }).join('');
}
var bq = [
'0044006f006e002700740020006e0065007600650072002000740072007900200074006f0020006a00750064006700650020006d006500200044007500640065002c00200079006f007500200064006f006e002700740020006b006e006f0077002000770068006100740020004600750063006b002000490020006200650065006e0020007400680072006f007500670068',
'00490074002700730020006f006e006c00790020006100660074006500720020007700650027007600650020006c006f0073007400200065007600650072007400680069006e0067002000740068006100740020007700650027007200650020006600720065006500200074006f00200064006f00200061006e0079007400680069006e00670021',
'0049002000620065006c006900650076006500200077006800610074006500760065007200200064006f00650073006e002700740020006b0069006c006c00200079006f0075002c002000730069006d0070006c00790020006d0061006b0065007300200079006f00750020002e002e002e00200073007400720061006e006700650072',
'53c25dee591a60014e435e78798f672c6e90',
'4f6095ee6211898153bb54114f5565b9ff0c62116307774059276d77768465b95411',
'81ea62116210957f970089819760624b6deb',
'4e0d8981636262114e0b573aff0c62116b7b540e591a7684662f65f695f44f11606f',
'5982679c676f5b5076844f7f547d662f76db6c34ff0c90a34e48676f5b504f1a57286ee1768465f650199ad85174ff0c7a7a768465f6501960b254c03002',
'004c0065007300730020006900730020006d006f00720065002000530069006d0070006c00650020006900730020006200650074007400650072002000540061006c006b002000690073002000630068006500610070',
'6ca16709624d534e53bb900962e900206ca1670980c691cf53bb4f5c6076',
'0057006f006f00640065006e7237723765595bfc62114eec898160f36253597d740376847b2c4e004ef64e8b5c31662f65747406597d4f607684889c5b50ff0c7cfb7d274f607684978b5e26ff5e',
'4e0d4f1a4e00520791cd542f753581114e0d80fd89e351b3768495ee9898',
'65624e8e8d2875918fdd53cd76f489c976844e8b7269ff0c5bf9672a77e576844e8b726963015f00653e60015ea63002',
'603b662f60f3644681314e0e8fc753bb768451737cfbff0c53ef53c865e0529b5efa7acb65b0768451737cfbff0c4f1a4e0d4f1a54ea4e0059295c3188ab0020006700610072006200610067006500200063006f006c006c0065006300740069006f006e00204e863002',
'4f60522b60f377e59053621152305e95662f8c01002c00204e5f522b60f3770b523062117684865a4f2a',
'79d15b664e005b9a5f8872316d6a6f2bff0c56e04e3a4ed6603b662f8bd556fe63ed53bb6d6a6f2b7684591688633002',
'621172ec81ea8d708fc74f608eab65c100205e766ca167098bdd89815bf94f608bb2',
'00540068006500730065002000770061006c006c007300200061007200650020006b0069006e00640020006f0066002000660075006e006e00790020006c0069006b006500200074006800610074003a0046006900720073007400200079006f0075002000680061007400650020007400680065006d002c007400680065006e00200079006f007500200067006500740020007500730065006400200074006f0020007400680065006d002c0045006e006f007500670068002000740069006d00650020007000610073007300650064002c00670065007400200073006f00200079006f007500200064006500700065006e00640020006f006e0020007400680065006d002e00540068006100740027007300200069006e0073007400690074007500740069006f006e0061006c0069007a0069006e00673002',
'0049006e00200061006e002000690073006f006c0061007400650064002000730079007300740065006d002c00740068006500200065006e00740072006f00700079002000630061006e0020006f006e006c007900200069006e006300720065006100730065002e',
'5f534e004e2a60b289c24e3b4e498005633a597d7684ff0c89814e484f60662f5bf97684ff0c89814e487ed3679c662f597d76843002',
'903b8f91ff0c4e0079cd4e0d4e9a4e8e8d8580fd529b537453c851418bb84efb4f554eba53bb638c63e176844e1c897f3002',
'0049003a4e0d53ef907f514d76846b7b4ea1',
'00490049003a51855fc36df1590476845b6472ec611f',
'004900490049003a5bf981ea753176848ffd6c42',
'00490056003a751f6d3b5e7665e0663e800c661389c17684610f4e4953ef8a00'
]

var input = document.getElementById("quote");
input.innerText = frombq(bq[random(bq.length)]);
// print all quote
// for (b in bq){console.log(frombq(bq[b]))};