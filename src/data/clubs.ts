import { Club } from "../engine/types";

// id|name|code|country|color1|color2|tier (1 famous ... 5 deep cut)
const RAW = `
man-united|Manchester United|MUN|England|#DA291C|#FFE500|1
man-city|Manchester City|MCI|England|#6CABDD|#1C2C5B|1
liverpool|Liverpool|LIV|England|#C8102E|#00B2A9|1
arsenal|Arsenal|ARS|England|#EF0107|#9C824A|1
chelsea|Chelsea|CHE|England|#034694|#F0F0F0|1
tottenham|Tottenham Hotspur|TOT|England|#132257|#F0F0F0|1
newcastle|Newcastle United|NEW|England|#241F20|#F0F0F0|1
aston-villa|Aston Villa|AVL|England|#670E36|#95BFE5|1
west-ham|West Ham United|WHU|England|#7A263A|#1BB1E7|1
everton|Everton|EVE|England|#003399|#F0F0F0|2
leicester|Leicester City|LEI|England|#003090|#FDDF00|2
leeds|Leeds United|LEE|England|#FFCD00|#1D428A|2
nottingham-forest|Nottingham Forest|NFO|England|#DD0000|#F0F0F0|3
brighton|Brighton & Hove Albion|BHA|England|#0057B8|#FFCD00|2
crystal-palace|Crystal Palace|CRY|England|#1B458F|#C4122E|2
wolves|Wolverhampton Wanderers|WOL|England|#FDB913|#231F20|2
fulham|Fulham|FUL|England|#F0F0F0|#000000|3
brentford|Brentford|BRE|England|#E30613|#FBB800|3
west-brom|West Bromwich Albion|WBA|England|#122347|#F0F0F0|3
sunderland|Sunderland|SUN|England|#EB172B|#F7A800|3
middlesbrough|Middlesbrough|MID|England|#E11B22|#F0F0F0|3
stoke|Stoke City|STK|England|#E03A3E|#F0F0F0|3
norwich|Norwich City|NOR|England|#00A14B|#FFF200|3
southampton|Southampton|SOU|England|#D71920|#130C0E|3
burnley|Burnley|BUR|England|#6C1D45|#99D6EA|3
sheffield-united|Sheffield United|SHU|England|#EE2737|#F0F0F0|3
derby|Derby County|DER|England|#F0F0F0|#000000|4
ipswich|Ipswich Town|IPS|England|#3A64A3|#F0F0F0|3
qpr|Queens Park Rangers|QPR|England|#1D70B7|#F0F0F0|4
watford|Watford|WAT|England|#FBEE02|#000000|4
blackburn|Blackburn Rovers|BLB|England|#009EE0|#F0F0F0|4
bolton|Bolton Wanderers|BOL|England|#263A69|#CE1124|4
birmingham|Birmingham City|BIR|England|#0033A0|#F0F0F0|4
coventry|Coventry City|COV|England|#0059A2|#61B4E4|4
portsmouth|Portsmouth|POR|England|#001489|#F0F0F0|4
hull|Hull City|HUL|England|#F89F1B|#000000|4
cardiff|Cardiff City|CAR|Wales|#D22630|#1D59AB|3
swansea|Swansea City|SWA|Wales|#F0F0F0|#000000|4
charlton|Charlton Athletic|CHA|England|#E03A3E|#F0F0F0|5
reading|Reading FC|REA|England|#004B9E|#F0F0F0|4
wimbledon-afc|AFC Wimbledon|WIM|England|#004C9B|#FDE047|5
millwall|Millwall|MIL|England|#1B3F6B|#F0F0F0|5
sheffield-wednesday|Sheffield Wednesday|SHW|England|#0057B8|#F0F0F0|4
luton|Luton Town|LUT|England|#F78F1E|#274488|4
wigan|Wigan Athletic|WIG|England|#2A3E7C|#F0F0F0|5
huddersfield|Huddersfield Town|HUD|England|#0E74BC|#F0F0F0|5
barnsley|Barnsley|BAR|England|#ED1B2F|#F0F0F0|5
blackpool|Blackpool|BLP|England|#F89F1B|#000000|5
real-madrid|Real Madrid|RMA|Spain|#FEBE10|#00529F|1
barcelona|Barcelona|BAR|Spain|#A50044|#004D98|1
atletico|Atlético Madrid|ATM|Spain|#CB3524|#26356E|1
sevilla|Sevilla|SEV|Spain|#D8412F|#F0F0F0|2
betis|Real Betis|BET|Spain|#00954C|#F0F0F0|2
valencia|Valencia|VAL|Spain|#EE3524|#F0F0F0|2
villarreal|Villarreal|VIL|Spain|#FFE667|#005187|2
real-sociedad|Real Sociedad|RSO|Spain|#0067B1|#F0F0F0|2
athletic|Athletic Club|ATH|Spain|#EE2523|#F0F0F0|2
celta|Celta Vigo|CEL|Spain|#8AC3EE|#E1251B|3
getafe|Getafe|GET|Spain|#005999|#F0F0F0|3
rayo|Rayo Vallecano|RVA|Spain|#E53027|#F0F0F0|3
osasuna|Osasuna|OSA|Spain|#0A346F|#D91A21|3
mallorca|Mallorca|MAL|Spain|#E20613|#000000|3
girona|Girona|GIR|Spain|#CD2534|#F0F0F0|3
espanyol|Espanyol|ESP|Spain|#007FC8|#F0F0F0|3
levante|Levante|LEV|Spain|#A50044|#005999|4
sporting-gijon|Sporting Gijón|SPO|Spain|#E03A3E|#F0F0F0|4
deportivo|Deportivo La Coruña|DEP|Spain|#0057B8|#F0F0F0|4
zaragoza|Real Zaragoza|ZAR|Spain|#1A56A5|#F0F0F0|4
malaga|Málaga CF|MAL|Spain|#315CA2|#86C2EA|4
granada|Granada CF|GRA|Spain|#C3213A|#F0F0F0|4
alaves|Deportivo Alavés|ALA|Spain|#0543A5|#F0F0F0|4
valladolid|Real Valladolid|VLL|Spain|#692EA4|#F0F0F0|4
las-palmas|Las Palmas|LPA|Spain|#FFE400|#005999|4
cadiz|Cádiz CF|CAD|Spain|#F8C500|#0033A0|4
elche|Elche CF|ELC|Spain|#00694B|#F0F0F0|4
eibar|SD Eibar|EIB|Spain|#AE1818|#002D62|5
tenerife|CD Tenerife|TEN|Spain|#005999|#F0F0F0|5
racing-santander|Racing Santander|RAC|Spain|#00694B|#F0F0F0|5
oviedo|Real Oviedo|OVI|Spain|#0057B8|#F8C500|5
juventus|Juventus|JUV|Italy|#000000|#F0F0F0|1
inter|Inter Milan|INT|Italy|#0068A8|#221F20|1
milan|AC Milan|MIL|Italy|#FB090B|#000000|1
napoli|Napoli|NAP|Italy|#12A0D7|#003E83|1
roma|Roma|ROM|Italy|#8E1F2F|#F0BC42|1
lazio|Lazio|LAZ|Italy|#87D8F7|#123274|2
atalanta|Atalanta|ATA|Italy|#1E71B8|#000000|2
fiorentina|Fiorentina|FIO|Italy|#582C83|#F0F0F0|2
torino|Torino|TOR|Italy|#8B0000|#F0F0F0|3
bologna|Bologna|BOL|Italy|#1A2F48|#A21C26|3
sampdoria|Sampdoria|SAM|Italy|#0F63B2|#D71920|3
genoa|Genoa|GEN|Italy|#00205B|#C8102E|3
udinese|Udinese|UDI|Italy|#000000|#F0F0F0|3
verona|Hellas Verona|VER|Italy|#002D62|#F8C500|3
sassuolo|Sassuolo|SAS|Italy|#00A651|#000000|4
cagliari|Cagliari|CAG|Italy|#A01F24|#002D62|3
empoli|Empoli|EMP|Italy|#0057B8|#F0F0F0|4
parma|Parma|PAR|Italy|#F8C500|#0057B8|3
palermo|Palermo|PAL|Italy|#F79AD3|#000000|4
bari|Bari|BRI|Italy|#E4292C|#F0F0F0|4
brescia|Brescia|BRE|Italy|#0E74BC|#F0F0F0|4
catania|Catania|CAT|Italy|#C8102E|#00A3E0|4
chievo|Chievo Verona|CHI|Italy|#F8C500|#0057B8|5
lecce|Lecce|LEC|Italy|#E4292C|#F8C500|4
monza|Monza|MON|Italy|#C8102E|#F0F0F0|4
salernitana|Salernitana|SAL|Italy|#9E0029|#F0F0F0|5
cremonese|Cremonese|CRE|Italy|#C8102E|#808080|5
spal|SPAL|SPA|Italy|#0057B8|#F0F0F0|5
perugia|Perugia|PER|Italy|#C8102E|#F0F0F0|5
vicenza|Vicenza|VIC|Italy|#C8102E|#F0F0F0|5
reggina|Reggina|REG|Italy|#872529|#000000|5
foggia|Foggia|FOG|Italy|#C8102E|#000000|5
bayern|Bayern Munich|FCB|Germany|#DC052D|#0066B2|1
dortmund|Borussia Dortmund|BVB|Germany|#FDE100|#000000|1
leverkusen|Bayer Leverkusen|B04|Germany|#E32221|#000000|2
leipzig|RB Leipzig|RBL|Germany|#DD0741|#001F47|2
gladbach|Borussia M'gladbach|BMG|Germany|#000000|#17A05D|2
schalke|Schalke 04|S04|Germany|#0063A9|#F0F0F0|2
hamburg|Hamburger SV|HSV|Germany|#005CA9|#F0F0F0|3
werder|Werder Bremen|SVW|Germany|#1D9053|#F0F0F0|3
stuttgart|VfB Stuttgart|VFB|Germany|#E32219|#F0F0F0|2
frankfurt|Eintracht Frankfurt|SGE|Germany|#E1000F|#000000|2
wolfsburg|VfL Wolfsburg|WOB|Germany|#65B32E|#F0F0F0|3
hoffenheim|TSG Hoffenheim|TSG|Germany|#1961AC|#F0F0F0|3
freiburg|SC Freiburg|SCF|Germany|#CC0000|#000000|3
koln|FC Köln|KOE|Germany|#ED1C24|#F0F0F0|3
hertha|Hertha Berlin|BSC|Germany|#005CA9|#F0F0F0|3
union-berlin|Union Berlin|FCU|Germany|#D4011C|#F9E300|3
kaiserslautern|Kaiserslautern|FCK|Germany|#E30613|#F0F0F0|4
nuernberg|Nürnberg|FCN|Germany|#B3012C|#F0F0F0|4
bochum|VfL Bochum|BOC|Germany|#005CA9|#F0F0F0|4
mainz|Mainz 05|M05|Germany|#C3141E|#F0F0F0|3
darmstadt|SV Darmstadt 98|D98|Germany|#003DA5|#F0F0F0|4
augsburg|FC Augsburg|FCA|Germany|#BA3733|#46714D|4
bielefeld|Arminia Bielefeld|DSC|Germany|#005CA9|#000000|4
duisburg|MSV Duisburg|MSV|Germany|#005CA9|#F0F0F0|5
dresden|Dynamo Dresden|SGD|Germany|#F9E300|#000000|4
hansa-rostock|Hansa Rostock|FCH|Germany|#005CA9|#F0F0F0|5
magdeburg|1. FC Magdeburg|FCM|Germany|#0066B3|#F0F0F0|5
fortuna-duesseldorf|Fortuna Düsseldorf|F95|Germany|#E30613|#F0F0F0|4
munich-1860|1860 Munich|TSV|Germany|#009EE0|#F0F0F0|5
st-pauli|St. Pauli|STP|Germany|#4B2E2A|#F0F0F0|4
psg|Paris Saint-Germain|PSG|France|#004170|#DA291C|1
marseille|Marseille|OM|France|#2FAEE0|#F0F0F0|1
lyon|Lyon|OL|France|#DA001A|#002B5C|2
monaco|AS Monaco|ASM|Monaco|#CE1126|#F0F0F0|2
lille|Lille|LOSC|France|#E01E13|#122457|2
nice|Nice|NIC|France|#CC0000|#000000|3
bordeaux|Bordeaux|GIR|France|#001B4E|#F0F0F0|3
saint-etienne|Saint-Étienne|ASSE|France|#009E60|#F0F0F0|3
nantes|Nantes|FCN|France|#FCD405|#009E60|3
rennes|Rennes|REN|France|#E2001A|#000000|3
toulouse|Toulouse|TFC|France|#5F259F|#F0F0F0|3
lens|Lens|RCL|France|#FFED02|#CE1126|3
strasbourg|Strasbourg|RCS|France|#009FE3|#F0F0F0|3
montpellier|Montpellier|MHSC|France|#FF8A00|#002D62|4
auxerre|Auxerre|AJA|France|#0055A4|#F0F0F0|4
reims|Reims|REI|France|#E2001A|#F0F0F0|4
bastia|Bastia|SCB|France|#00A3E0|#F0F0F0|5
metz|Metz|MET|France|#7D1C24|#57A0D3|4
sochaux|Sochaux|FCS|France|#FFED02|#0055A4|5
angers|Angers|SCO|France|#000000|#F0F0F0|4
lorient|Lorient|FCL|France|#F97316|#000000|4
brest|Brest|SB29|France|#E2001A|#F0F0F0|4
caen|Caen|SMC|France|#E2001A|#002D62|5
guingamp|Guingamp|EAG|France|#E2001A|#000000|5
le-havre|Le Havre|HAC|France|#68BDE8|#002D62|5
benfica|Benfica|SLB|Portugal|#E83F3F|#F0F0F0|1
porto|FC Porto|FCP|Portugal|#0033A0|#F0F0F0|1
sporting|Sporting CP|SCP|Portugal|#007A3D|#F0F0F0|2
braga|Braga|SCB|Portugal|#C8102E|#F0F0F0|3
guimaraes|Vitória Guimarães|VSC|Portugal|#000000|#F0F0F0|4
boavista|Boavista|BFC|Portugal|#000000|#F0F0F0|4
maritimo|Marítimo|CSM|Portugal|#00A651|#E2001A|5
famalicao|Famalicão|FAM|Portugal|#0055A4|#F0F0F0|5
rio-ave|Rio Ave|RAF|Portugal|#00A651|#F0F0F0|5
belenenses|Belenenses|BEL|Portugal|#0055A4|#F0F0F0|5
academica|Académica|AAC|Portugal|#000000|#F0F0F0|5
ajax|Ajax|AJA|Netherlands|#D2122E|#F0F0F0|1
psv|PSV Eindhoven|PSV|Netherlands|#ED1C24|#F0F0F0|1
feyenoord|Feyenoord|FEY|Netherlands|#EE1C25|#F0F0F0|2
az|AZ Alkmaar|AZ|Netherlands|#EE1C25|#F0F0F0|3
twente|Twente|TWE|Netherlands|#DA291C|#F0F0F0|3
utrecht|Utrecht|UTR|Netherlands|#EE1C25|#F0F0F0|4
vitesse|Vitesse|VIT|Netherlands|#FFD200|#000000|4
groningen|Groningen|GRO|Netherlands|#00A651|#F0F0F0|4
heerenveen|Heerenveen|HEE|Netherlands|#0057B8|#EE1C25|4
sparta-rotterdam|Sparta Rotterdam|SPA|Netherlands|#EE1C25|#F0F0F0|5
nec|NEC Nijmegen|NEC|Netherlands|#E2001A|#00A651|5
willem-ii|Willem II|WIL|Netherlands|#C8102E|#F0F0F0|5
nac|NAC Breda|NAC|Netherlands|#FFD200|#000000|5
celtic|Celtic|CEL|Scotland|#006747|#F0F0F0|2
rangers|Rangers|RAN|Scotland|#1C4FA1|#E4002B|2
aberdeen|Aberdeen|ABE|Scotland|#E2001A|#F0F0F0|4
hearts|Hearts|HEA|Scotland|#7C062A|#F0F0F0|4
hibernian|Hibernian|HIB|Scotland|#00694B|#F0F0F0|5
dundee-united|Dundee United|DUN|Scotland|#F07F00|#000000|5
motherwell|Motherwell|MOT|Scotland|#F0A300|#7C062A|5
kilmarnock|Kilmarnock|KIL|Scotland|#0057B8|#F0F0F0|5
anderlecht|Anderlecht|RSC|Belgium|#B4153B|#F0F0F0|3
club-brugge|Club Brugge|CLB|Belgium|#1A63BB|#000000|3
standard|Standard Liège|STA|Belgium|#C8102E|#F0F0F0|4
genk|Genk|GEN|Belgium|#0057B8|#F0F0F0|3
gent|Gent|GNT|Belgium|#17A0DB|#002D62|4
antwerp|Antwerp|ANT|Belgium|#C8102E|#F0F0F0|4
charleroi|Charleroi|CHA|Belgium|#000000|#F0F0F0|5
mechelen|Mechelen|MEC|Belgium|#F8C500|#C8102E|5
galatasaray|Galatasaray|GAL|Turkey|#A90432|#FFB300|2
fenerbahce|Fenerbahçe|FEN|Turkey|#FFED00|#163962|2
besiktas|Beşiktaş|BJK|Turkey|#000000|#F0F0F0|3
trabzonspor|Trabzonspor|TS|Turkey|#8C2633|#5BA3CF|4
basaksehir|Başakşehir|IBFK|Turkey|#C8102E|#002D62|4
bursaspor|Bursaspor|BUR|Turkey|#00A651|#F0F0F0|5
goztepe|Göztepe|GOZ|Turkey|#FFD200|#C8102E|5
konyaspor|Konyaspor|KON|Turkey|#00A651|#F0F0F0|5
olympiacos|Olympiacos|OLY|Greece|#C8102E|#F0F0F0|3
panathinaikos|Panathinaikos|PAO|Greece|#007A3D|#F0F0F0|3
aek-athens|AEK Athens|AEK|Greece|#FFD200|#000000|4
paok|PAOK|PAOK|Greece|#000000|#F0F0F0|4
aris|Aris Thessaloniki|ARI|Greece|#FFD200|#000000|5
flamengo|Flamengo|FLA|Brazil|#C8102E|#000000|1
palmeiras|Palmeiras|PAL|Brazil|#006437|#F0F0F0|1
corinthians|Corinthians|COR|Brazil|#000000|#F0F0F0|2
sao-paulo|São Paulo|SAO|Brazil|#C8102E|#000000|2
santos|Santos|SAN|Brazil|#F0F0F0|#000000|2
fluminense|Fluminense|FLU|Brazil|#880038|#006437|3
botafogo|Botafogo|BOT|Brazil|#000000|#F0F0F0|3
vasco|Vasco da Gama|VAS|Brazil|#000000|#F0F0F0|3
gremio|Grêmio|GRE|Brazil|#0096D6|#000000|3
internacional|Internacional|INT|Brazil|#C8102E|#F0F0F0|3
atletico-mineiro|Atlético Mineiro|CAM|Brazil|#000000|#F0F0F0|3
cruzeiro|Cruzeiro|CRU|Brazil|#003DA5|#F0F0F0|3
bahia|Bahia|BAH|Brazil|#0055A4|#C8102E|4
vitoria-br|Vitória|VIT|Brazil|#C8102E|#000000|4
atletico-pr|Athletico Paranaense|CAP|Brazil|#C8102E|#000000|4
coritiba|Coritiba|CTB|Brazil|#006437|#F0F0F0|5
goias|Goiás|GOI|Brazil|#00A651|#F0F0F0|5
sport-recife|Sport Recife|SPT|Brazil|#C8102E|#000000|5
fortaleza-br|Fortaleza|FOR|Brazil|#1D3A8F|#C8102E|4
ceara|Ceará|CEA|Brazil|#000000|#F0F0F0|5
boca|Boca Juniors|BOC|Argentina|#003DA5|#FFD200|1
river|River Plate|RIV|Argentina|#C8102E|#F0F0F0|1
racing-club|Racing Club|RAC|Argentina|#7EC3F0|#F0F0F0|3
independiente|Independiente|IND|Argentina|#C8102E|#F0F0F0|3
san-lorenzo|San Lorenzo|SLO|Argentina|#003DA5|#8C1F28|4
estudiantes|Estudiantes|EDL|Argentina|#C8102E|#F0F0F0|4
gimnasia|Gimnasia La Plata|GLP|Argentina|#1D3A8F|#F0F0F0|5
newells|Newell's Old Boys|NOB|Argentina|#C8102E|#000000|4
rosario-central|Rosario Central|CAR|Argentina|#1D3A8F|#FFD200|5
velez|Vélez Sarsfield|VEL|Argentina|#003DA5|#F0F0F0|4
argentinos-juniors|Argentinos Juniors|ARG|Argentina|#C8102E|#1D3A8F|5
lanus|Lanús|LAN|Argentina|#7A1F2B|#F0F0F0|5
banfield|Banfield|BAN|Argentina|#006437|#F0F0F0|5
huracan|Huracán|HUR|Argentina|#C8102E|#F0F0F0|5
talleres|Talleres Córdoba|TAL|Argentina|#1D3A8F|#C8102E|5
la-galaxy|LA Galaxy|LAG|USA|#00245D|#FFD200|3
inter-miami|Inter Miami|MIA|USA|#F5B6CD|#000000|2
lafc|LAFC|LFC|USA|#C39953|#000000|3
seattle|Seattle Sounders|SEA|USA|#5D9741|#005595|3
red-bulls|NY Red Bulls|RBNY|USA|#ED1C24|#002B5C|3
nycfc|NYCFC|NYC|USA|#6CACE4|#F07736|4
atlanta-united|Atlanta United|ATL|USA|#80000A|#A19060|3
chicago-fire|Chicago Fire|CHI|USA|#B3060F|#002B5C|4
dc-united|DC United|DCU|USA|#000000|#C8102E|4
houston-dynamo|Houston Dynamo|HOU|USA|#F36F21|#002B5C|4
columbus-crew|Columbus Crew|CLB|USA|#FFE400|#000000|3
portland|Portland Timbers|POR|USA|#004812|#EBE727|4
sporting-kc|Sporting Kansas City|SKC|USA|#93B1D7|#002B5C|5
toronto-fc|Toronto FC|TOR|Canada|#C8102E|#4F5B60|4
montreal|CF Montréal|MTL|Canada|#101820|#214FC6|4
orlando|Orlando City|ORL|USA|#633492|#F0B323|4
austin|Austin FC|ATX|USA|#00B140|#000000|4
cincinnati|FC Cincinnati|CIN|USA|#FE5000|#003087|4
nashville|Nashville SC|NSH|USA|#F0C800|#132643|5
philadelphia|Philadelphia Union|PHI|USA|#0F2342|#99B3C4|5
new-england|New England Revolution|NER|USA|#C8102E|#002B5C|5
san-jose|San Jose Earthquakes|SJ|USA|#0051BA|#000000|5
salt-lake|Real Salt Lake|RSL|USA|#910026|#002B5C|5
minnesota|Minnesota United|MIN|USA|#85B5D8|#0A2240|5
charlotte-fc|Charlotte FC|CLT|USA|#0A2240|#C6A052|5
ny-cosmos|New York Cosmos|NYC|USA|#00694B|#FFD200|5
club-america|Club América|AME|Mexico|#FFE400|#003DA5|2
chivas|Chivas Guadalajara|GUA|Mexico|#C8102E|#003DA5|3
cruz-azul|Cruz Azul|CAZ|Mexico|#003DA5|#C8102E|3
pumas|Pumas UNAM|PUM|Mexico|#003DA5|#FFD200|4
tigres|Tigres UANL|TIG|Mexico|#FFD200|#003DA5|3
monterrey|Monterrey|MTY|Mexico|#003DA5|#F0F0F0|3
santos-laguna|Santos Laguna|SAN|Mexico|#00A651|#F0F0F0|5
toluca|Toluca|TOL|Mexico|#C8102E|#F0F0F0|4
pachuca|Pachuca|PAC|Mexico|#003DA5|#F0F0F0|4
leon|Club León|LEO|Mexico|#006437|#F0F0F0|4
atlas|Atlas|ATL|Mexico|#C8102E|#000000|5
necaxa|Necaxa|NEC|Mexico|#C8102E|#006437|5
queretaro|Querétaro|QRO|Mexico|#003DA5|#000000|5
shakhtar|Shakhtar Donetsk|SHA|Ukraine|#F26522|#000000|3
dynamo-kyiv|Dynamo Kyiv|DYK|Ukraine|#0057B8|#F0F0F0|3
dnipro|Dnipro Dnipropetrovsk|DNI|Ukraine|#003DA5|#F0F0F0|5
zenit|Zenit Saint Petersburg|ZEN|Russia|#009FDF|#F0F0F0|3
cska-moscow|CSKA Moscow|CSK|Russia|#C8102E|#003DA5|4
spartak-moscow|Spartak Moscow|SPM|Russia|#C8102E|#F0F0F0|4
al-hilal|Al-Hilal|HIL|Saudi Arabia|#003DA5|#F0F0F0|2
al-nassr|Al-Nassr|NSR|Saudi Arabia|#FFE400|#003DA5|2
al-ahli|Al-Ahli|AHL|Saudi Arabia|#00A651|#F0F0F0|3
al-ittihad|Al-Ittihad|ITT|Saudi Arabia|#FFE400|#000000|3
al-ettifaq|Al-Ettifaq|ETT|Saudi Arabia|#006437|#C8102E|5
al-sadd|Al-Sadd|SAD|Qatar|#F0F0F0|#000000|4
al-duhail|Al-Duhail|DUH|Qatar|#C8102E|#F0F0F0|4
al-rayyan|Al-Rayyan|RAY|Qatar|#C8102E|#000000|5
al-ain|Al-Ain|AIN|UAE|#5F259F|#F0F0F0|4
al-wasl|Al-Wasl|WAS|UAE|#FFE400|#003DA5|5
guangzhou|Guangzhou FC|GUA|China|#C8102E|#F0F0F0|4
shanghai-port|Shanghai Port|SIP|China|#C8102E|#003DA5|5
shandong|Shandong Taishan|SDT|China|#FF8A00|#003DA5|5
kashima|Kashima Antlers|KSM|Japan|#8C1F28|#003DA5|4
urawa|Urawa Red Diamonds|URW|Japan|#C8102E|#000000|4
gamba|Gamba Osaka|GAM|Japan|#003DA5|#000000|5
yokohama|Yokohama F. Marinos|YFM|Japan|#003DA5|#C8102E|4
kawasaki|Kawasaki Frontale|KWF|Japan|#0F63B2|#000000|5
vissel-kobe|Vissel Kobe|VIS|Japan|#8A1538|#F0F0F0|4
jeonbuk|Jeonbuk Hyundai|JEO|South Korea|#00694B|#F0F0F0|4
ulsan|Ulsan HD|ULS|South Korea|#003DA5|#FFE400|4
fc-seoul|FC Seoul|SEO|South Korea|#C8102E|#000000|4
suwon|Suwon Samsung Bluewings|SUW|South Korea|#003DA5|#F0F0F0|5
sydney-fc|Sydney FC|SYD|Australia|#68BDE8|#002D62|5
melbourne-victory|Melbourne Victory|MVC|Australia|#003DA5|#FFE400|5
western-sydney|Western Sydney Wanderers|WSW|Australia|#C8102E|#000000|5
kaizer-chiefs|Kaizer Chiefs|KAI|South Africa|#FFD200|#000000|3
orlando-pirates|Orlando Pirates|ORL|South Africa|#000000|#F0F0F0|3
sundowns|Mamelodi Sundowns|SUN|South Africa|#FFD200|#006437|4
al-ahly-eg|Al Ahly|AHL|Egypt|#C8102E|#F0F0F0|3
zamalek|Zamalek|ZAM|Egypt|#F0F0F0|#C8102E|4
raja|Raja Casablanca|RCA|Morocco|#00A651|#F0F0F0|4
wydad|Wydad Casablanca|WAC|Morocco|#C8102E|#F0F0F0|4
esperance|Espérance de Tunis|EST|Tunisia|#FFE400|#C8102E|4
usm-alger|USM Alger|USM|Algeria|#C8102E|#000000|5
mc-alger|MC Alger|MCA|Algeria|#00A651|#C8102E|5
enyimba|Enyimba|ENY|Nigeria|#003DA5|#F0F0F0|5
asante-kotoko|Asante Kotoko|ASK|Ghana|#C8102E|#FFE400|5
hearts-oak|Hearts of Oak|HOO|Ghana|#C8102E|#003DA5|5
tp-mazembe|TP Mazembe|MAZ|DR Congo|#000000|#F0F0F0|5
asec|ASEC Mimosas|ASE|Ivory Coast|#FFE400|#000000|5
coton-sport|Coton Sport|COT|Cameroon|#00A651|#F0F0F0|5
persepolis|Persepolis|PER|Iran|#C8102E|#F0F0F0|4
esteghlal|Esteghlal|EST|Iran|#003DA5|#F0F0F0|4
al-shorta|Al-Shorta|SHO|Iraq|#00A651|#F0F0F0|5
al-zawraa|Al-Zawraa|ZWR|Iraq|#F0F0F0|#000000|5
pakhtakor|Pakhtakor Tashkent|PAK|Uzbekistan|#003DA5|#FFE400|5
olimpia-asuncion|Olimpia Asunción|OLI|Paraguay|#000000|#F0F0F0|5
cerro-porteno|Cerro Porteño|CER|Paraguay|#003DA5|#C8102E|5
penarol|Peñarol|PEN|Uruguay|#FFE400|#000000|3
nacional|Nacional (Uruguay)|NAC|Uruguay|#003DA5|#C8102E|3
colo-colo|Colo-Colo|COL|Chile|#000000|#F0F0F0|3
u-de-chile|Universidad de Chile|UCH|Chile|#003DA5|#C8102E|4
u-católica|Universidad Católica|UCA|Chile|#003DA5|#C8102E|5
atletico-nacional|Atlético Nacional|ANV|Colombia|#00A651|#F0F0F0|4
millonarios|Millonarios|MIL|Colombia|#003DA5|#F0F0F0|4
america-cali|América de Cali|AME|Colombia|#C8102E|#F0F0F0|4
barcelona-sc|Barcelona SC|BSC|Ecuador|#FFE400|#C8102E|5
ldu-quito|LDU Quito|LDU|Ecuador|#F0F0F0|#C8102E|4
emelec|Emelec|EME|Ecuador|#003DA5|#F0F0F0|5
universitario|Universitario|UNI|Peru|#7A1F2B|#F0F0F0|5
alianza-lima|Alianza Lima|ALI|Peru|#003DA5|#F0F0F0|5
sporting-cristal|Sporting Cristal|CRI|Peru|#68BDE8|#F0F0F0|5
bolivar-club|Bolívar|BOL|Bolivia|#68BDE8|#F0F0F0|5
the-strongest|The Strongest|STR|Bolivia|#FFE400|#000000|5
caracas-fc|Caracas FC|CAR|Venezuela|#C8102E|#000000|5
saprissa|Saprissa|SAP|Costa Rica|#7A1F2B|#F0F0F0|5
alajuelense|Alajuelense|LDA|Costa Rica|#C8102E|#000000|5
herediano|Herediano|HER|Costa Rica|#FFE400|#C8102E|5
olimpia-honduras|Olimpia Honduras|OLI|Honduras|#F0F0F0|#003DA5|5
motagua|Motagua|MOT|Honduras|#003DA5|#C8102E|5
tauro|Tauro FC|TAU|Panama|#000000|#F0F0F0|5
auckland-city|Auckland City|AKL|New Zealand|#68BDE8|#F0F0F0|5
red-star|Red Star Belgrade|RST|Serbia|#C8102E|#003DA5|3
partizan|Partizan Belgrade|PAR|Serbia|#000000|#F0F0F0|4
dinamo-zagreb|Dinamo Zagreb|DIN|Croatia|#0057B8|#F0F0F0|3
hajduk-split|Hajduk Split|HAJ|Croatia|#0057B8|#F0F0F0|4
steaua|Steaua București|STB|Romania|#003DA5|#C8102E|4
rapid-bucuresti|Rapid București|RBU|Romania|#7A1F2B|#F0F0F0|5
cska-sofia|CSKA Sofia|CSS|Bulgaria|#C8102E|#000000|5
levski-sofia|Levski Sofia|LEV|Bulgaria|#003DA5|#F0F0F0|5
sparta-prague|Sparta Prague|SPA|Czech Republic|#8C1F28|#F0F0F0|4
slavia-prague|Slavia Prague|SLA|Czech Republic|#C8102E|#003DA5|4
slovan-bratislava|Slovan Bratislava|SLO|Slovakia|#68BDE8|#C8102E|5
ferencvaros|Ferencváros|FTC|Hungary|#00A651|#F0F0F0|4
ujpest|Újpest FC|UJP|Hungary|#5F259F|#F0F0F0|5
legia|Legia Warsaw|LEG|Poland|#00694B|#C8102E|4
lech|Lech Poznań|LEC|Poland|#003DA5|#F0F0F0|4
wisla|Wisła Kraków|WIS|Poland|#C8102E|#F0F0F0|5
gornik|Górnik Zabrze|GOR|Poland|#003DA5|#C8102E|5
dinamo-bucuresti|Dinamo București|DIN|Romania|#C8102E|#F0F0F0|5
malmo|Malmö FF|MFF|Sweden|#68BDE8|#003DA5|4
ifk-goteborg|IFK Göteborg|IFK|Sweden|#003DA5|#F0F0F0|4
aik|AIK Stockholm|AIK|Sweden|#000000|#FFE400|5
djurgarden|Djurgården|DIF|Sweden|#173F93|#C8102E|5
brondby|Brøndby IF|BIF|Denmark|#FFE400|#003DA5|4
fc-copenhagen|FC Copenhagen|FCK|Denmark|#003DA5|#F0F0F0|3
rosenborg|Rosenborg|RBK|Norway|#000000|#F0F0F0|4
molde|Molde FK|MOL|Norway|#003DA5|#F0F0F0|5
salzburg|Red Bull Salzburg|RBS|Austria|#C8102E|#002D62|3
sturm-graz|Sturm Graz|STU|Austria|#000000|#F0F0F0|5
rapid-wien|Rapid Wien|RAP|Austria|#006437|#F0F0F0|5
austria-wien|Austria Wien|AUS|Austria|#5F259F|#F0F0F0|5
basel|FC Basel|BAS|Switzerland|#C8102E|#003DA5|4
young-boys|Young Boys|YB|Switzerland|#FFE400|#000000|4
zuerich|FC Zürich|ZUR|Switzerland|#003DA5|#F0F0F0|5
grasshopper|Grasshopper Club|GC|Switzerland|#003DA5|#F0F0F0|5
dynamo-tbilisi|Dinamo Tbilisi|DTB|Georgia|#003DA5|#F0F0F0|5
qarabag|Qarabağ|QAR|Azerbaijan|#000000|#F0F0F0|5
bodo-glimt|Bodø/Glimt|GLI|Norway|#FFE400|#000000|4
midtjylland|Midtjylland|MID|Denmark|#C8102E|#000000|4
`.trim();

export const CLUBS: Club[] = RAW.split("\n").map((line) => {
  const [id, name, code, country, c1, c2, tier] = line.split("|");
  return { id, name, code, country, c1, c2, tier: Number(tier) };
});
