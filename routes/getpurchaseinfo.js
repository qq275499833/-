let express = require('express');
let router = express.Router();
let toolkit = require('../help/comm/toolkit');
router.get(['/','/:lang'],function(req,res){
    toolkit.visit_stats(req);
    try{
        let lang=req.params.lang?req.params.lang:"tw";
        let successlang=global.Lang["下单成功"][lang];
        let minutes=global.Lang["分钟前"][lang];
        let arr=[];
        let headimg=["images/head1.png","images/head2.png","images/head3.png","images/head4.png","images/head5.png",
            "images/head6.png","images/head7.png","images/head8.png","images/head9.png","images/head10.png",
            "images/head11.png","images/head12.png","images/head13.png","images/head14.png","images/head15.png",
            "images/head16.png","images/head17.png","images/head18.png","images/head19.png","images/head20.png",
            "images/head21.png","images/head22.png","images/head23.png","images/head24.png","images/head25.png",
            "images/head26.png","images/head27.jpg","images/head28.jpg","images/head29.jpg","images/head30.jpg"];
        let city={
            "tw":["台北市", "基隆市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
                "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "台南市", "高雄市",
                "屏東縣", "宜蘭縣", "台東縣", "花蓮縣", "金門縣", "嘉義縣", "連江縣",
                "澎湖縣", "基隆市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣",
                "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "台南市", "高雄市",
                "屏東縣", "宜蘭縣", "台東縣", "花蓮縣", "金門縣", "嘉義縣", "連江縣",
                "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "台南市", "高雄市",
                "屏東縣", "宜蘭縣", "台東縣", "花蓮縣", "金門縣", "嘉義縣", "連江縣"],
            "th":["กรุงเทพมหานคร","สมุทรปราการ","นนทบุรี","ปทุมธานี","อยุธยา","อ่างทอง",
                "ลพบุรี","สิงห์บุรี","ชัยนาท","สระบุรี","ชลบุรี","ระยอง","จันทบุรี","ตราด","ฉะเชิงเทรา",
                "ปราจีนบุรี","นครนายก","สระแก้ว","นครราชสีมา","บุรีรัมย์","สุรินทร์","ศรีสะเกษ","อุบลราชธานี",
                "ยโสธร","ชัยภูมิ","อำนาจเจริญ","บึงกาฬ","หนองบัวลำภู","ขอนแก่น","อุดรธานี","เลย","หนองคาย",
                "มหาสารคาม","ร้อยเอ็ด","กาฬสินธุ์","สกลนคร","นครพนม","มุกดาหาร","เชียงใหม่","ลำพูน","ลำปาง",
                "อุตรดิตถ์","แพร่","น่าน","พะเยา","เชียงราย","แม่ฮ่องสอน","นครสวรรค์","อุทัยธานี","กำแพงเพชร",
                "ตาก","สุโขทัย","พิษณุโลก","พิจิตร","เพชรบูรณ์","ราชบุรี","กาญจนบุรี","สุพรรณบุรี","นครปฐม",
                "สมุทรสาคร","สมุทรสงคราม","เพชรบุรี","ประจวบคีรีขันธ์","นครศรีธรรมราช","กระบี่","พังงา","ภูเก็ต",
                "สุราษฎร์ธานี","ระนอง","ชุมพร","สงขลา","สตูล","ตรัง","พัทลุง","ปัตตานี","ยะลา","นราธิวาส"],
            "hk":["中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區",
                "中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區",
                "中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區",
                "中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區",
                "中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區",
                "中西區","灣仔區","東區","南區","九龍城區","觀塘區","深水埗區","黃大仙區","油尖旺區","西區"],
            "my":["Pulau Pinang", "Kedah","Kelantan","Terengganu","Pahang", "Perak","Selangor","WP Kuala Lumpur",
                "WP Putrajaya", "Negeri Sembilan","Melaka", "Johor","Sabah","Sarawak","Perlis",
                "Pulau Pinang", "Kedah","Kelantan","Terengganu","Pahang", "Perak","Selangor","WP Kuala Lumpur",
                "WP Putrajaya", "Negeri Sembilan","Melaka", "Johor","Sabah","Sarawak","Perlis",
                "Pulau Pinang", "Kedah","Kelantan","Terengganu","Pahang", "Perak","Selangor","WP Kuala Lumpur",
                "WP Putrajaya", "Negeri Sembilan","Melaka", "Johor","Sabah","Sarawak","Perlis",
                "Pulau Pinang", "Kedah","Kelantan","Terengganu","Pahang", "Perak","Selangor","WP Kuala Lumpur",
                "WP Putrajaya", "Negeri Sembilan","Melaka", "Johor","Sabah","Sarawak","Perlis"],
            // "sg":[],
        };
        let name={
            "tw": ["張吉*","徐雄*","李祐*","楊勝*","曾琪*","金葉*","王文*","童曉*",
                "鄭修*","黃寶*","龔飛*","吳苡*","陳淑*","魯金*","宋華*","鄭小*",
                "杜惠*","栗海*","蕭伯*","李寶*","鄭宇*","張玉*","姚妍*","洪曉*",
                "吳沛*","孟任*","趙建*","賀東*","洪于*","曾琪*","徐筱*","穆肜*",
                "鐘淑*","劉譯*","謝子*","楊璽*","江筱*","洪晶*","林欣*","吳凱*",
                "陳文*","顏宜*","江連*","王薇*","賈卿*","李慧*","張可*","范韶*",
                "宮富*","將浩*","單柏*","甄聖*","馮松*","師憶*","林虎*","趙小*",
                "郭淑*","梁雨*","賴義*","夏光*","藍佑*","彭毓*","陳國*","黃傑*",
                "阮晉*","房偉*","康密*","馬力*","路靈*","陳強*","孫志*","張洋*",
                "陳冠*","許佑*","梁玉*","黃昭*","鄧志*","顧昱*","蘇稟*","陳山*",
                "鍾佳*","蔡慶*","廉薇*","余善*","黃雅*","陳美*","伊僅*","靳富*",
                "張晏*","林俊*","盧彥*","高源*","賴亦*","劉筱*","夏怡*","樊聞*",
                "蔡姿*","蘇建*","許彩*","葉錦*","楊定*","段紀*","吳玉*","林志*",
                "簡麗*","翁郁*","洪莉*","潘敬*","田喬*","李文*","劉先*","韓雨*",
                "沈孝*","李文*","黃裕*","李致*","陳秋*","森田*","賀雲*","褚咏*",
                "邱啟*","林品*","林昆*","洪裕*","蔡佳*","詹筱*","丁冠*","張卲*",
                "張芸*","吳孟*","宋鴻*","黃勝*","祁俞*","洪金*","鍾念*","葉氏*",
                "王子*","羅際*","劉澤*","黃清*","蔡岳*","薛榆*","劉貴*","陳聖*"],
            "th":["ฮามัม", "รัสรินทร์ธร อินทร์ศร", "คุณจินตนา เดชทองคำ", "พัชรศรี  ใจสุข", "Nana",
                "เบญญาภา นพตากูล", "เยาวลักษณ์ เทวอักษร","จีรภา นุชบาง", "ณัฐนันท์ วสุหิรัญแสง",
                "ธนัทธรณ์  ดลอัครทรัพ", "ณัฐภรณ์  จีนบุญ", "สมพร  บางปา", "วิไลลักษณ์ ชัยภิบสล",
                "ับภา ศรีสฺพรรณว", "วิไล หลำวรรณะ", "อรทัย", "นี", "กรองกาญน์ รัตนศศิวิม", "ดาหยิ่น",
                "ใกล้รุ่ง  แสงทอง", "สุรีย์ ศิริเมธานนท์", "พ.จ.อ.รชานนท์ ทิมโพธ", "อัจฉราทิพย์​ ช่วง​ทอ",
                "นุชนาถ ผดุงกิจ", "ฐิติยา จันทร์น้อย", "เทียมใจ ปิ่นทอง", "นางอารีย์. ไกรทรัพร์", "เกสรา บุญศรี",
                "ฉัตรกุล อินหนองฉาง", "วันชนะ  บุญปก  ดาโรจ", "คุณา มีทองคำ", "สนใจค่ะ",
                "รัชนี นวลละออง", "อารียา. เต็มเมือง", "คุณรัชนี นวลละออง", "พรประภา พรสุขสว่าง", "วาริน. ใจห้าว",
                "กิตติยา กัยาวิริยะ", "เขมชนิดาภา ฤทธิกาญจน", "ธนัชพัชญ์ สุขวัฒน์พง", "ประทุม สกุลเด็น",
                "ชาลี สุวรรณ", "คุณปวริศ.  มีสุข", "จุฑารัตน์ สมาแห", "ศศิธร หนุ่นหนุนรบ", "ชนากานต์ กันแลบ",
                "ชนากานต์ สมบูรณ์", "มธุกุลยา ทองวิเชียร", "อ้าย", "แก้ว"],
            "hk":["沈孝*","李文*","黃裕*","李致*","陳秋*","森田*","黃雲*","褚咏*",
                "邱啟*","林品*","林昆*","洪裕*","蔡佳*","詹筱*","張芯*","張卲*",
                "張芸*","吳孟*","宋鴻*","黃勝*","陳姿*","洪金*","鍾念*","丁氏*",
                "孫富*","將浩*","曾柏*","徐聖*","馮松*","林憶*","林晉*","趙小*",
                "陳淑*","梁雨*","賴義*","夏光*","吳佑*","彭毓*","陳國*","黃傑*",
                "林晉*","林芳*","莊密*","馬力*","張靈*","陳強*","張志*","張洋*",
                "張吉*","徐雄*","李祐*","楊勝*","曾琪*","朱厚*","張文*","天童*",
                "鄭修*","黃寶*","龔翔*","吳苡*","陳淑*","潘金*","宋華*","鄭小*",
                "陳冠*","許佑*","梁玉*","黃昭*","鄧志*","陳昱*","蘇稟*","陳山*",
                "鍾佳*","蔡慶*","廉薇*","余善*","黃雅*","陳美*","陳俊*","靳富*",
                "吳沛*","黃任*","趙建*","莊孟*","洪于*","張玉*","林妍*","洪曉*",
                "潘惠*","林宜*","蕭伯*","黃寶*","楊宇*","曾琪*","徐筱*","林肜*",
                "鐘淑*","劉譯*","謝孟*","謝璽*","江筱*","洪晶*","林欣*","江政*",
                "陳文*","林宜*","林欣*","王薇*","陳卿*","陳慧*","陳飛*","范韶*",
                "林晏*","林俊*","盧彥*","高源*","賴亦*","江筱*","朱怡*","龔彥*",
                "林姿*","蘇建*","許彩*","葉錦*","楊定*","段紀*","吳玉*","林志*",
                "簡麗*","翁郁*","洪莉*","潘敬*","林喬*","李文*","劉先*","韓雨*",
                "王子*","羅際*","劉澤*","黃清*","蔡岳*","薛榆*","劉貴*","陳聖*"],
            "my":["Ten chang lai", "Too yan Tong", "Lee Kar Leong", "Lim Soon Seng",
                "kenny wong", "Alex lim", "Syed malik bin syed", "Mohamad Sedik b Zaka",
                "Lee .ML.", "Fah HengTong", "Lim siew eng", "Mohammad Razali bin", "CHEAH SIA HUA",
                "Hew Gwo Shing", "Chin Jun Yung", "Wazir Abdullah", "Zaini yusof", "CHAI CHOON LOONG",
                "Francis Leow", "Mohd shafi", "Dee", "Ben", "ricky", "Faat", "SCOTT LYE",
                "Resources Sdn", "Mahzan che mohamed", "Koi Muk Seng", "Jijoey", "NG WAI SEE",
                "Lim Tin Hong", "soin chee ping", "Ryan Heng", "Jason Ng", "wong chee cheong",
                "ONG Poh Lai", "許玉筠", "yeoh hooi kheng", "Lee Hong Eng", "Tan Mei Chen",
                "Jess Chew", "kong zi yen", "ENG VOON NGAH", "Tan Hooi Kean", "Mandy Cham", "low soke bee",
                "cho chee mei", "Karen Chan", "Jane Teoh Siew Ching", "Yen yuet peng"]
            // "sg":["Wong Ken Seng", "Jermen Yong", "Joe Wong", "Jimmy Teng", "Micheal yong", "Chier hee",
            //     "Chee min yew", "陈新美", "Helen", "Ong", "Ishak", "Moh Chan Wai", "cheah kiah yong",
            //     "Dennis kee", "HENG L G", "Lynn", "David", "Low", "Willy Siow", "蔡佳杙", "Nick shuih wah",
            //     "Lee", "Girlie Teoh", "Ng Tang chong", "Chong Lai Poh", "Katherine Wong", "Joyce Kwang", "Lee Choong hian",
            //     "JeAnne Tan", "Lee yen luan", "Shirley Teo", "BonnieCheaw", "Chua Teng Kee", "Nancy", "Jenny  ng",
            //     "ong cheah kwee", "Kenny Tan Yi Rong", "Eileen Tay", "Margaret Toh", "Dorothy", "Joey", "Jacelyn Seow",
            //     "LIM SIAK YI", "BenChew", "Chuyuchin", "Andy ong", "ong kheng guan", "nelly", "Low", "Ivy Tan"]

        };
        for(let i=0;i<50;i++){
            let index=parseInt(Math.random()*25);
            if(city[lang]&&name[lang]){
                arr.push({"img":headimg[index], "info":city[lang][index]+name[lang][index]+successlang+(index+1)+minutes});
            }

        }
        res.send(arr);
    } catch (err) {
        toolkit.Catch(null,null,err);
        res.send([]);
    }
});
module.exports = router;