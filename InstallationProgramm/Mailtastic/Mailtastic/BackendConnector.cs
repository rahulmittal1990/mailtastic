using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Mailtastic
{
    class BackendConnector
    {

       private string apiUrl = "http://default-environment-q3w7vutw76.elasticbeanstalk.com/account/getsignature";
        //private string apiUrl = "https://www.app.mailtastic.de/api/account/getsignature";

        public string getSnippet(string id)
        {


            try {
                using (var wb = new WebClient())
                {
                    var data = new NameValueCollection();
                    data["id"] = id;
                    data["code"] = "4677fgh6";  //damit eine ganze kleine sicherheit besteht dass nicht jeder direkt alls ids durchprobiert
                    var response = wb.UploadValues(this.apiUrl, "POST", data);
                    string responseText = Encoding.UTF8.GetString(response);




                    return responseText;
                }
            }
            catch (Exception)
            {

                return null;
            }

          
        }
    }
}
