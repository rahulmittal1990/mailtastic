using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Mailtastic
{
    class OutlookSigFileHandler
    {

        private bool isSignatureAvailable;
        private string signaturePath;
        string messageboxheadline = "Mailtastic EasyIntegrate";
        public OutlookSigFileHandler()
        {
            this.initSignaturePath();

        }

        /*
        * returns:  determines path of signatures
        */
        public void initSignaturePath()
        {
            //app data path
            string path = this.getAppdataPath();

            //get language
            CultureInfo ci = CultureInfo.InstalledUICulture;
            string language = ci.EnglishName;
            string signatureText = "";
            switch (language)
            {
                //case "German (Germany)" :  signatureText = "Signaturen"; break;
                //case "English (England)": signatureText = "Signatures"; break;
                default:   signatureText = "Signatures"; break;
            }


            if (Directory.Exists(path + "/Microsoft/"+ signatureText))   //WINDOWS XP
            {
                this.isSignatureAvailable = true; ;
                this.signaturePath = path + "/Microsoft/" + signatureText;
            }
            else if(Directory.Exists(path + "/Roaming/Microsoft/" + signatureText)){  //WINDOWS 7+
                this.isSignatureAvailable = true; ;
                this.signaturePath = path + "/Roaming/Microsoft/" + signatureText;
            }
            else
            {
                this.isSignatureAvailable = false;
                MessageBox.Show("Es wurde keine Signatur gefunden. Bitte legen Sie in Outlook eine Signatur an und führen Sie Mailtastic EasyIntegrate danach erneut aus.",
                  messageboxheadline,
                  MessageBoxButtons.OK,
                  MessageBoxIcon.Error,
                  MessageBoxDefaultButton.Button1);
                System.Windows.Forms.Application.Exit();

            }
            
        }

        private string getAppdataPath()
        {

            return Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        }

        public List<string> getSignaturNames()
        {
            if(this.isSignatureAvailable == false)
            {
                return new List<string>();
            }
            else
            {
                List<string> filepaths = Directory.EnumerateFiles(this.signaturePath).ToList();
                List<string> fileNames = new List<string>();
                foreach (var path in filepaths)
                {
                    string name = Path.GetFileName(path);
                    string extension = Path.GetExtension(path);
                    if(extension == ".html" || extension == ".htm")
                    {
                        fileNames.Add(name.Substring(0, name.LastIndexOf(".")));    //punkt abschneiden
                    }
                }

                return fileNames;
            }
        } 

        private string getSigFilePath(string signame)
        {
            if(this.isSignatureAvailable == false)
            {
                return "";
            }
            else
            {
               return this.signaturePath + "/" + signame + ".htm";
            }
        }


        /**
        *writes snippet into signature file or 
        */
        public bool writeMailtasticSnippetToFile(string signame, string snippet)
        {

            

            string endPhrase = "</body>";

            //npcName = @"[/item1]"; <-- note the '/'.
            string lineToAdd = snippet;
            lineToAdd = "<br>" + snippet;
            string fileName = this.getSigFilePath(signame);
            List<string> txtLines = new List<string>();

            //Fill a List<string> with the lines from the txt file.
            foreach (string str in File.ReadAllLines(fileName, System.Text.Encoding.Default))
            {
                txtLines.Add(str);
            }



            //Insert the line you want to add last under the tag 'item1'.
            var occurence = txtLines.IndexOf(endPhrase);
            if (occurence == -1)
            {
                //Datei bestitzt kein schließendes BODY tag daher wird der snippet einfach unten angehängt
                /*MessageBox.Show("Die ausgewählte Signatur ist nicht korrekt formatiert. Die Installation ist nicht möglich. Bitte wenden Sie sich in den Support unter support@mailtastic.de oder unter 06131 747 887",
                    "Signatur Fehlerhaft",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error,
                    MessageBoxDefaultButton.Button1);

                return false;*/

                txtLines.Add(lineToAdd);
            }
            else {
                txtLines.Insert(txtLines.IndexOf(endPhrase)-1, lineToAdd);  //eine zeile über dem closing body tag
            }
            //Clear the file. The using block will close the connection immediately.
            using (File.Create(fileName)) { }

            //Add the lines including the new one.
            foreach (string str in txtLines)
            {
                File.AppendAllText(fileName, str + Environment.NewLine, System.Text.Encoding.Default);
            }
            return true;
            
          
        }

        public bool isMailtasticAlreadyInstalled(string signame)
        {
            if (this.isSignatureAvailable)
            {

                try
                {
                    foreach (string line in File.ReadLines(this.getSigFilePath(signame)))
                    {
                        if (line.Contains("app.mailtastic"))
                        {
                            return true;
                        }
                    }
                }
                catch (Exception)
                {
                    MessageBox.Show("Ihre Signaturdatei kann nicht gelesen werden. Bitte schließen Sie Outlook und versuchen es erneut. Falls weiterhin Probleme auftreten, wenden Sie sich bitte an den Support: support@mailtastic.de",
                  messageboxheadline,
                  MessageBoxButtons.OK,
                  MessageBoxIcon.Information,
                  MessageBoxDefaultButton.Button1);
                }
                

                return false;

            }
            else
            {
                return false;
            }
           
           
        }

    }
}
