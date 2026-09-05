import { NationalTeam } from "../engine/types";

// id|name|code|confederation|color1|color2|tier (1 famous ... 5 deep cut)
const RAW = `
argentina|Argentina|ARG|CONMEBOL|#74ACDF|#0B2B5C|1
brazil|Brazil|BRA|CONMEBOL|#FFDF00|#009C3B|1
france|France|FRA|UEFA|#002395|#ED2939|1
england|England|ENG|UEFA|#F0F0F0|#C8102E|1
germany|Germany|GER|UEFA|#F0F0F0|#1A1A1A|1
spain|Spain|ESP|UEFA|#AA151B|#F1BF00|1
portugal|Portugal|POR|UEFA|#046A38|#DA291C|1
netherlands|Netherlands|NED|UEFA|#F36C21|#21468B|1
belgium|Belgium|BEL|UEFA|#DA291C|#FDDA24|1
italy|Italy|ITA|UEFA|#0066CC|#003399|1
croatia|Croatia|CRO|UEFA|#ED1C24|#171796|1
uruguay|Uruguay|URU|CONMEBOL|#5CBFEB|#001489|1
mexico|Mexico|MEX|CONCACAF|#006341|#CE1126|1
usa|United States|USA|CONCACAF|#3C3B6E|#B22234|1
japan|Japan|JPN|AFC|#003DA5|#BC002D|1
south-korea|South Korea|KOR|AFC|#C60C30|#003478|1
australia|Australia|AUS|AFC|#FFCD00|#00843D|1
nigeria|Nigeria|NGA|CAF|#008751|#FFFFFF|1
egypt|Egypt|EGY|CAF|#CE1126|#000000|1
morocco|Morocco|MAR|CAF|#C1272D|#006233|1
senegal|Senegal|SEN|CAF|#00853F|#FDEF42|1
ghana|Ghana|GHA|CAF|#CE1126|#FCD116|1
colombia|Colombia|COL|CONMEBOL|#FCD116|#003893|1
chile|Chile|CHI|CONMEBOL|#D52B1E|#0039A6|1
switzerland|Switzerland|SUI|UEFA|#DA291C|#F0F0F0|1
denmark|Denmark|DEN|UEFA|#C8102E|#F0F0F0|2
sweden|Sweden|SWE|UEFA|#006AA7|#FECC00|2
norway|Norway|NOR|UEFA|#BA0C2F|#00205B|2
poland|Poland|POL|UEFA|#DC143C|#F0F0F0|2
austria|Austria|AUT|UEFA|#ED2939|#F0F0F0|2
scotland|Scotland|SCO|UEFA|#003399|#F0F0F0|2
wales|Wales|WAL|UEFA|#00AB39|#C8102E|2
turkey|Turkey|TUR|UEFA|#E30A17|#F0F0F0|2
ukraine|Ukraine|UKR|UEFA|#0057B7|#FFD500|2
serbia|Serbia|SRB|UEFA|#C6363C|#0C4076|2
czech-republic|Czech Republic|CZE|UEFA|#11457E|#D7141A|2
romania|Romania|ROU|UEFA|#002B7F|#FCD116|2
greece|Greece|GRE|UEFA|#0D5EAF|#F0F0F0|2
russia|Russia|RUS|UEFA|#D52B1E|#0039A6|2
ecuador|Ecuador|ECU|CONMEBOL|#FFDD00|#0072CE|2
peru|Peru|PER|CONMEBOL|#D91023|#F0F0F0|2
paraguay|Paraguay|PAR|CONMEBOL|#D52B1E|#0038A8|2
costa-rica|Costa Rica|CRC|CONCACAF|#CE1126|#002B7F|2
canada|Canada|CAN|CONCACAF|#D80621|#F0F0F0|2
iran|Iran|IRN|AFC|#239F40|#DA0000|2
saudi-arabia|Saudi Arabia|KSA|AFC|#006C35|#F0F0F0|2
qatar|Qatar|QAT|AFC|#8D1B3D|#F0F0F0|2
iraq|Iraq|IRQ|AFC|#007A3D|#000000|2
tunisia|Tunisia|TUN|CAF|#E70013|#F0F0F0|2
algeria|Algeria|ALG|CAF|#006233|#F0F0F0|2
cameroon|Cameroon|CMR|CAF|#007A5E|#FCD116|2
ivory-coast|Ivory Coast|CIV|CAF|#F77F00|#009E60|2
mali|Mali|MLI|CAF|#14B53A|#FCD116|2
dr-congo|DR Congo|COD|CAF|#007FFF|#F7D618|2
south-africa|South Africa|RSA|CAF|#007A4D|#FFB612|2
jamaica|Jamaica|JAM|CONCACAF|#009B3A|#FED100|2
new-zealand|New Zealand|NZL|OFC|#F0F0F0|#000000|2
uzbekistan|Uzbekistan|UZB|AFC|#0099B5|#1EB53A|2
hungary|Hungary|HUN|UEFA|#CE2939|#477050|2
republic-of-ireland|Republic of Ireland|IRL|UEFA|#169B62|#FF883E|2
finland|Finland|FIN|UEFA|#002F6C|#F0F0F0|2
iceland|Iceland|ISL|UEFA|#02529C|#DC1E28|2
slovakia|Slovakia|SVK|UEFA|#0B4EA2|#EE1620|2
slovenia|Slovenia|SVN|UEFA|#005DA4|#ED1C24|2
bosnia|Bosnia & Herzegovina|BIH|UEFA|#002395|#FECB00|2
north-macedonia|North Macedonia|MKD|UEFA|#D20000|#FFE600|2
china|China PR|CHN|AFC|#EE1C25|#FFDE00|2
bulgaria|Bulgaria|BUL|UEFA|#00966E|#D62612|3
albania|Albania|ALB|UEFA|#E41E20|#000000|3
montenegro|Montenegro|MNE|UEFA|#C40308|#D3AE3B|3
kosovo|Kosovo|KOS|UEFA|#244AA5|#D0A650|3
belarus|Belarus|BLR|UEFA|#C8313E|#4AA657|3
georgia|Georgia|GEO|UEFA|#FF0000|#F0F0F0|3
israel|Israel|ISR|UEFA|#0038B8|#F0F0F0|3
cyprus|Cyprus|CYP|UEFA|#D57800|#006064|3
luxembourg|Luxembourg|LUX|UEFA|#ED2939|#00A1DE|3
armenia|Armenia|ARM|UEFA|#D90012|#F2A800|3
kazakhstan|Kazakhstan|KAZ|UEFA|#00AFCA|#FEC50C|3
azerbaijan|Azerbaijan|AZE|UEFA|#00B5E2|#EF3340|3
estonia|Estonia|EST|UEFA|#0072CE|#000000|3
latvia|Latvia|LVA|UEFA|#9E3039|#F0F0F0|3
lithuania|Lithuania|LTU|UEFA|#006A44|#FDB913|3
moldova|Moldova|MDA|UEFA|#0046AE|#FFD200|3
faroe-islands|Faroe Islands|FRO|UEFA|#ED2939|#00205B|4
malta|Malta|MLT|UEFA|#CF142B|#F0F0F0|4
andorra|Andorra|AND|UEFA|#FEDD00|#D50032|4
san-marino|San Marino|SMR|UEFA|#5EB6E4|#F0F0F0|5
liechtenstein|Liechtenstein|LIE|UEFA|#002B7F|#CE1126|5
gibraltar|Gibraltar|GIB|UEFA|#DA0001|#F3E100|5
bolivia|Bolivia|BOL|CONMEBOL|#007934|#D52B1E|3
venezuela|Venezuela|VEN|CONMEBOL|#7F1D1D|#F2C200|3
panama|Panama|PAN|CONCACAF|#DA121A|#005293|3
honduras|Honduras|HON|CONCACAF|#0073CF|#F0F0F0|3
guatemala|Guatemala|GUA|CONCACAF|#4997D0|#F0F0F0|4
el-salvador|El Salvador|SLV|CONCACAF|#0F47AF|#F0F0F0|4
trinidad-tobago|Trinidad & Tobago|TRI|CONCACAF|#E00000|#000000|3
haiti|Haiti|HAI|CONCACAF|#D21034|#00209F|4
cuba|Cuba|CUB|CONCACAF|#002A8F|#CF142B|5
nicaragua|Nicaragua|NCA|CONCACAF|#2E4F9E|#F0F0F0|5
curacao|Curaçao|CUW|CONCACAF|#002B7F|#F9E300|4
suriname|Suriname|SUR|CONCACAF|#377E3F|#B40A2F|4
grenada|Grenada|GRN|CONCACAF|#FCD116|#CE1126|5
barbados|Barbados|BRB|CONCACAF|#00267F|#FFC726|5
bermuda|Bermuda|BER|CONCACAF|#C8102E|#00205B|5
dominican-republic|Dominican Republic|DOM|CONCACAF|#002D62|#CE1126|4
belize|Belize|BLZ|CONCACAF|#171696|#DA291C|5
antigua|Antigua & Barbuda|ATG|CONCACAF|#E00000|#FCD116|5
st-kitts|Saint Kitts & Nevis|SKN|CONCACAF|#FCD116|#009E49|5
north-korea|North Korea|PRK|AFC|#024FA2|#ED1C27|5
syria|Syria|SYR|AFC|#CE1126|#007A3D|4
jordan|Jordan|JOR|AFC|#F0F0F0|#007A3D|3
lebanon|Lebanon|LIB|AFC|#EE1620|#00A651|4
oman|Oman|OMA|AFC|#DB161B|#008751|4
bahrain|Bahrain|BHR|AFC|#CE1126|#F0F0F0|4
kuwait|Kuwait|KUW|AFC|#007A3D|#000000|4
palestine|Palestine|PLE|AFC|#007A3D|#CE1126|4
india|India|IND|AFC|#128807|#FF9933|3
thailand|Thailand|THA|AFC|#A51931|#2D2A4A|3
vietnam|Vietnam|VIE|AFC|#DA251D|#FFDE00|3
indonesia|Indonesia|IDN|AFC|#FF0000|#F0F0F0|3
malaysia|Malaysia|MAS|AFC|#FEDD00|#000000|4
singapore|Singapore|SIN|AFC|#ED2939|#F0F0F0|4
tajikistan|Tajikistan|TJK|AFC|#CC0000|#006600|4
turkmenistan|Turkmenistan|TKM|AFC|#28AE66|#F0F0F0|5
kyrgyzstan|Kyrgyzstan|KGZ|AFC|#E8112D|#FFEF00|5
bangladesh|Bangladesh|BAN|AFC|#006A4E|#F42A41|5
sri-lanka|Sri Lanka|SRI|AFC|#FFBE29|#8D153A|5
yemen|Yemen|YEM|AFC|#CE1126|#000000|5
afghanistan|Afghanistan|AFG|AFC|#D32011|#007A36|5
nepal|Nepal|NEP|AFC|#DC143C|#003893|5
myanmar|Myanmar|MYA|AFC|#FECB00|#34B233|5
philippines|Philippines|PHI|AFC|#CE1126|#0038A8|4
cambodia|Cambodia|CAM|AFC|#032EA1|#E00025|5
laos|Laos|LAO|AFC|#CE1126|#002868|5
mongolia|Mongolia|MGL|AFC|#C4272F|#015197|5
hong-kong|Hong Kong|HKG|AFC|#DE2110|#F0F0F0|5
chinese-taipei|Chinese Taipei|TPE|AFC|#000095|#FE0000|5
guam|Guam|GUM|AFC|#D22730|#00297F|5
maldives|Maldives|MDV|AFC|#D21034|#007E3A|5
zambia|Zambia|ZAM|CAF|#198A00|#DE2010|3
zimbabwe|Zimbabwe|ZIM|CAF|#FFD200|#006400|4
uganda|Uganda|UGA|CAF|#FCDC04|#D90000|4
tanzania|Tanzania|TAN|CAF|#1EB53A|#00A3DD|4
kenya|Kenya|KEN|CAF|#922529|#006600|4
rwanda|Rwanda|RWA|CAF|#00A1DE|#FAD201|5
ethiopia|Ethiopia|ETH|CAF|#078930|#FCDD09|4
sudan|Sudan|SUD|CAF|#D21034|#007229|5
libya|Libya|LBY|CAF|#239E46|#000000|4
angola|Angola|ANG|CAF|#CC092F|#FFCB00|4
mozambique|Mozambique|MOZ|CAF|#007168|#FCE100|5
botswana|Botswana|BOT|CAF|#75AADB|#F0F0F0|5
namibia|Namibia|NAM|CAF|#003580|#D21034|5
malawi|Malawi|MWI|CAF|#CE1126|#339E35|5
madagascar|Madagascar|MAD|CAF|#FC3D32|#007E3A|4
mauritania|Mauritania|MTN|CAF|#006233|#FFC400|4
guinea|Guinea|GUI|CAF|#CE1126|#FCD116|4
guinea-bissau|Guinea-Bissau|GNB|CAF|#CE1126|#F7C600|5
sierra-leone|Sierra Leone|SLE|CAF|#1EB53A|#0072C6|4
liberia|Liberia|LBR|CAF|#BF0A30|#002868|4
togo|Togo|TOG|CAF|#006A4E|#FFCE00|4
benin|Benin|BEN|CAF|#E8112D|#FCD116|5
niger|Niger|NIG|CAF|#E05206|#F0F0F0|5
gabon|Gabon|GAB|CAF|#009E60|#FCD116|4
equatorial-guinea|Equatorial Guinea|EQG|CAF|#3E9A00|#E32119|5
eswatini|Eswatini|SWZ|CAF|#3E5EB2|#B10C0C|5
lesotho|Lesotho|LES|CAF|#00209F|#009543|5
comoros|Comoros|COM|CAF|#3D8E33|#FFC61E|5
mauritius|Mauritius|MRI|CAF|#EA2839|#FFD500|5
cape-verde|Cape Verde|CPV|CAF|#003893|#CF2027|4
gambia|Gambia|GAM|CAF|#CE1126|#3A7728|4
burundi|Burundi|BDI|CAF|#1EB53A|#CE1126|5
somalia|Somalia|SOM|CAF|#4189DD|#F0F0F0|5
djibouti|Djibouti|DJI|CAF|#12AD2B|#6AB2E7|5
chad|Chad|CHA|CAF|#002664|#FECB00|5
central-african-rep|Central African Rep.|CTA|CAF|#003082|#289728|5
congo|Congo|CGO|CAF|#009543|#FBDE4A|4
south-sudan|South Sudan|SSD|CAF|#078930|#0F47AF|5
sao-tome|São Tomé & Príncipe|STP|CAF|#12AD2B|#FFCE00|5
seychelles|Seychelles|SEY|CAF|#003F87|#FCD856|5
eritrea|Eritrea|ERI|CAF|#EA0437|#12AD2B|5
burkina-faso|Burkina Faso|BFA|CAF|#009E49|#FCD116|3
fiji|Fiji|FIJ|OFC|#002868|#68BFE5|5
papua-new-guinea|Papua New Guinea|PNG|OFC|#CE1126|#000000|5
solomon-islands|Solomon Islands|SOL|OFC|#215B33|#FCD116|5
vanuatu|Vanuatu|VAN|OFC|#D21034|#009543|5
tahiti|Tahiti|TAH|OFC|#871932|#F0F0F0|5
new-caledonia|New Caledonia|NCL|OFC|#003DA5|#E4002B|5
samoa|Samoa|SAM|OFC|#CE1126|#002B7F|5
tonga|Tonga|TGA|OFC|#C10000|#F0F0F0|5
american-samoa|American Samoa|ASA|OFC|#002868|#BF0A30|5
cook-islands|Cook Islands|COK|OFC|#002868|#F0F0F0|5
niue|Niue|NIU|OFC|#FCD116|#002868|5
northern-mariana|Northern Mariana Is.|NMI|AFC|#002868|#8C1D40|5
timor-leste|Timor-Leste|TLS|AFC|#DC241F|#000000|5
brunei|Brunei|BRU|AFC|#F7E017|#000000|5
macau|Macau|MAC|AFC|#00A651|#F0F0F0|5
bhutan|Bhutan|BHU|AFC|#FF4E12|#FFD520|5
pakistan|Pakistan|PAK|AFC|#01411C|#F0F0F0|5
`.trim();

export const NATIONAL_TEAMS: NationalTeam[] = RAW.split("\n").map((line) => {
  const [id, name, code, confederation, c1, c2, tier] = line.split("|");
  return { id, name, code, confederation, c1, c2, tier: Number(tier) };
});
