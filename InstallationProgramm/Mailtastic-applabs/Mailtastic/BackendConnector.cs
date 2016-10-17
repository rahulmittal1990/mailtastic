using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Mailtastic
{
    class BackendConnector
    {

       

       private Dictionary<String, String> applabsIds = new Dictionary<string, string>()
    {
            {"f2244eed-8323-4060-a101-d08851e977da" ,   //Avarlik Oben    Ali aavarlik@applabs.de
            "45030487-08bf-4bc3-ae08-960bfbe4a393"},    //Avarlik Unten   Ali aavarlik@applabs.de
            {"a6d1fb07-98e9-4153-8d99-94690b88da43",    //Bertels Oben    Julian  jbertels@applabs.de
            "f5a9b64d-d319-4f2b-aaa7-35365ac50a5b"},    //Bertels Unten   Julian  jbertels@applabs.de
            {"eed28a63-99be-48e8-bd73-9a7def4ffd89",   //Brombach Oben   Thorsten    tbrombach@applabs.de
            "ce4f605c-2f10-451d-8b40-652033044063"}, //Brombach Unten  Thorsten    tbrombach@applabs.de
            {"976f55b1-3d4c-4699-ac9c-05490e39d669",  //EscrivÃ¡ Oben   Juan    jescriva@applabs.de
            "e9e7ee3d-8767-47ef-b1a9-0bba7fafee77"}, //EscrivÃ¡ Unten  Juan    jescriva@applabs.de
            {"1771397e-3205-4897-8d01-0646d287909f", //Etlich Oben Karsten ketlich@applabs.de
            "0041780d-3a2c-4ae9-9a84-536f2bae9ab7"}, //Etlich Unten    Karsten ketlich@applabs.de
            {"54a25c97-8185-4e39-a089-f78ac9474f5f", //Heiberger Oben  Jessica jheiberger@applabs.de
            "f495feb3-3087-4846-ace3-5f9068dde08e"},//Heiberger Unten Jessica jheiberger@applabs.de
            {"51fa2088-36c4-41e5-8bbb-2c8f17b204fe", //Helbach Oben    Sabine  shelbach@applabs.de
            "15a9fe5f-4ad8-4177-87ad-d7d912eac7a4"},  //Helbach Unten   Sabine  shelbach@applabs.de
            {"aaa216b4-bb46-49c3-8106-afd58f08b220", //Homann Oben Philipp phomann@applabs.de
            "cc76c6d3-0787-4c7d-971d-286580462fd2"},  //Homann Unten    Philipp phomann@applabs.de
            {"f8dc4d7a-48e5-4593-9463-d9cb56dcc422", //Hozic Oben  Sinan   shozic@applabs.de
            "60c9101c-cfc8-4f77-b112-7816110be2da"},  //Hozic Unten Sinan   shozic@applabs.de
            {"ea3b0020-0daa-4f48-bb95-73d93aa9d0b5", //KÃ¤lberer Oben  Valery  VKaelberer@applabs.de
            "4029d6fb-4d25-4e8b-a9a0-5fe7dc95bc94"},  //KÃ¤lberer Unten Valery  Vkaelberer@applabs.de
            {"f7c3c400-10a4-4d89-a7f0-141b16d311fb", //Killmaier Oben  Axel    AKillmaier@applabs.de
            "82bd10e7-da1c-462b-ab04-5c6f5e981b88"},  //Killmaier Unten Axel    Akillmaier@applabs.de
            {"df40da55-37ae-4dbb-812d-e50eef81f585", //Konda Oben  Fabian  Fkonda@applabs.de
            "3ce4c40d-da62-4941-9a7f-e88547ecf74d"},  //Konda Unten Fabian  Fkonda@applabs.de
            {"481a6c5c-90d4-489e-9806-cf24710bfee6", //Lange Oben  Pela    plange@applabs.de
            "1d03f59d-c462-4558-9a4c-8f6ca1689ecd"},  //Lange Unten Pela    plange@applabs.de
            {"f8797d58-5513-4a90-9fca-15b679548ad8", //Nacken Oben Christian   CNacken@applabs.de
            "4c6a049f-5117-4c92-8900-6b8667273280"},  //Nacken Unten    Christian   Cnacken@applabs.de
            {"a296c224-bb2c-4c7f-ac1d-2e83c7848ffc", //Rempel Oben Kai krempel@applabs.de
            "a22e137f-57bf-4bcf-b18d-d84323492af6"},  //Rempel Unten    Kai krempel@applabs.de
            {"fd92477a-6902-4cea-87d7-d34e15d6c6c3", //SchÃ¤fer Oben   Steven  SSchaefer@applabs.de
            "400cff96-79d1-480c-be49-22fc185580ab"},  //SchÃ¤fer Unten  Steven  Sschaefer@applabs.de
            {"2190b191-fe39-4fa8-8732-9fd8d56f13c6", //SchrÃ¶der Oben  Tim tschroeder@applabs.de
            "71100db3-7322-443a-8046-4755497c1378"},  //SchrÃ¶der Unten Tim tschroeder@applabs.de
            {"d724a554-0bb2-4ba6-8bcb-652b18d2376d", //Steinhauer Oben Uwe usteinhauer@applabs.de
            "2af719c1-36d0-4598-8465-d52423f67838"},  //Steinhauer Unten    Uwe usteinhauer@applabs.de
            {"37f256ce-c312-4355-9d2a-b8901579a263", //Talbi  Oben Assia   atalbi@applabs.de
            "7add99e1-e2c1-4639-a222-dd9682d5fff2"},  //Talbi  Unten    Assia   atalbi@applabs.de
};


        private const String snippet = @"<a href=""https://www.app.mailtastic.de/api/li/$$$ID$$$"" style=""outline:0 !important;display:block;"">
                    <img width=""700"" height=""210""  src=""https://www.app.mailtastic.de/api/im/$$$ID$$$/ad?m=o"" border=""0"" alt=""Bitte aktivieren Sie externe Inhalte, um aktuelle Informationen zu Applabs zu erhalten"" style=""color:blue;font-size:12px;""/></a>";

        public string getSnippet(string id)
        {
            if (!applabsIds.ContainsKey(id) || id==null)
            {
                MessageBox.Show("Ihr eingegebener Code war leider nicht korrekt. Bitte versuchen Sie es noch einmal oder wenden sich an den Support unter support@mailtastic.de",
               "SNIPPET ERZEUGT",
               MessageBoxButtons.OK,
               MessageBoxIcon.Error,
               MessageBoxDefaultButton.Button1);
                System.Windows.Forms.Application.Exit();
                return null;

            }
            else
            {
                string firstcode = id;
                string secondcode = applabsIds[id];

                string htmlSnippet = snippet.Replace("$$$ID$$$", firstcode);
                htmlSnippet += "<br>";
                htmlSnippet+= snippet.Replace("$$$ID$$$", secondcode);


              /*  MessageBox.Show("SNIPPET" + htmlSnippet,
                 "SNIPPET ERZEUGT",
                 MessageBoxButtons.OK,
                 MessageBoxIcon.Error,
                 MessageBoxDefaultButton.Button1);*/

                return htmlSnippet;

            }
     }
    }
}
