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
        * line is the line count where the old mailtastic signature was found
        *if it is -1 it was not found at all
        */
        public bool writeMailtasticSnippetToFile(string signame, string snippet, int lineIndexFromOldMailtasticSignature, string isSignatureOrCampaign)
        {

         

            string endPhrase = "</body>";

            //npcName = @"[/item1]"; <-- note the '/'.
            string lineToAdd = snippet;

            //clear newlines so the snippet is only one line. that is better when wanting to replace it later
            lineToAdd = lineToAdd.Replace(System.Environment.NewLine, "");
            lineToAdd = "<br>" + snippet;


            string fileName = this.getSigFilePath(signame);
            List<string> txtLines = new List<string>();

            //Fill a List<string> with the lines from the txt file.
            foreach (string str in File.ReadAllLines(fileName, System.Text.Encoding.Default))
            {
                txtLines.Add(str);
            }


            //when whole signature then clear all other content in signature
            if(isSignatureOrCampaign.Equals("signature"))
            {
                //get start and end index of body tags
                Tuple<int,int> bodyindex = this.getIndexOfBodyTag(txtLines);

                //remove everything inside body tag
                txtLines.RemoveRange(bodyindex.Item1 + 1, bodyindex.Item2 - bodyindex.Item1 - 1);

                //get updated index
                bodyindex = this.getIndexOfBodyTag(txtLines);

                //insert content above closing body
                txtLines.Insert(bodyindex.Item2, lineToAdd);  //eine zeile über dem closing body tag

            }
            else if (isSignatureOrCampaign.Equals("campaign"))  //if it is only campaign insert it at the bottom of the signature
            {
                //there was already a mailtastic signature inside so replace it
                if (lineIndexFromOldMailtasticSignature >= 0)
                {
                    txtLines[lineIndexFromOldMailtasticSignature] = lineToAdd;
                }
                else //there was no old mailtastic snippet
                {
                    //Insert the line you want to add last under the tag 'item1'.
                    var occurence = txtLines.IndexOf(endPhrase);
                    if (occurence == -1)    //if there is no body tag
                    {
                        txtLines.Add(lineToAdd);
                    }
                    else {
                        txtLines.Insert(txtLines.IndexOf(endPhrase), lineToAdd);  //eine zeile über dem closing body tag
                    }


                }
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

        //get start and end index of the body tags in signature file
        private Tuple<int, int> getIndexOfBodyTag(List<string> txtLines)
        {
            int firstvalue = -1;
            int secondvalue = -1;

            int count = 0;
            foreach (string str in txtLines)
            {
                if (str.Contains("<body"))
                {
                    firstvalue = count;

                }
                if (str.Contains("</body>"))
                {
                    secondvalue = count;

                }
                count++;
            }

            return Tuple.Create(firstvalue, secondvalue);
        }




        /// <summary>
        /// get the number of the line where the signature html was saved
        /// </summary>
        /// <param name="signame"></param>
        /// <returns></returns>
        public int getMailtasticLineInSignature(string signame)
        {

            if (this.isSignatureAvailable)
            {

                try
                {
                    int count = 0;
                    foreach (string line in File.ReadLines(this.getSigFilePath(signame)))
                    {
                        if (line.Contains("app.mailtastic"))
                        {
                            return count;
                        }

                        if (line.Contains("q3w7vutw76.elasticbeanstalk"))
                        {
                            return count;
                        }
                        count++;
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


                return -1;

            }
            else
            {
                return -1;
            }

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




                        if (line.Contains("q3w7vutw76.elasticbeanstalk"))
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
