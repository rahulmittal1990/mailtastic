using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Mailtastic
{
    public partial class MainForm : Form
    {
        private class comboBoxItem
        {
            public string Name;
            public comboBoxItem(string name)
            {
                Name = name;
            }

            public override string ToString()
            {
                // Generates the text shown in the combo box
                return Name;
            }
        }

        string messageboxheadline = "Mailtastic EasyIntegrate";
        OutlookSigFileHandler oSigFileH;
        BackendConnector bcon;

        public MainForm()
        {
            InitializeComponent();
            this.init();
        }

        public void init()
        {
            //backgroundcolor
            this.BackColor = Color.FromArgb(0, 159, 228);
            this.picture_loader.Hide();
            this.bcon = new BackendConnector();

            this.oSigFileH = new OutlookSigFileHandler();
            List<string> signatureNames = this.oSigFileH.getSignaturNames();
            if(signatureNames.Count == 0)
            {
                MessageBox.Show("Es wurde keine Signatur gefunden. Bitte legen Sie in Outlook eine Signatur an und führen Sie Mailtastic EasyIntegrate danach erneut aus.",
                  messageboxheadline,
                  MessageBoxButtons.OK,
                  MessageBoxIcon.Error,
                  MessageBoxDefaultButton.Button1);
                  System.Windows.Forms.Application.Exit();
            }
            else
            {
                this.comboBox_signatur.Items.Clear();
                foreach (string name in signatureNames)
                {
                    this.comboBox_signatur.Items.Add(new comboBoxItem(name));
                }
                this.comboBox_signatur.SelectedItem = this.comboBox_signatur.Items[0];
            }
            
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void button_jetzt_installieren_Click(object sender, EventArgs e)
        {

            Cursor.Current = Cursors.WaitCursor;
            this.picture_loader.Show();
            this.button_jetzt_installieren.Hide();
            var selectedSignature = this.comboBox_signatur.SelectedItem.ToString();
            Application.DoEvents();

            if (selectedSignature == null || selectedSignature == "")    //keine signatur ausgewähl
            {
                MessageBox.Show("Bitte wählen Sie zuerst eine Signatur aus.",
                    messageboxheadline,
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information,
                    MessageBoxDefaultButton.Button1);
            }
            else if(this.textfeld_code.Text == null || this.textfeld_code.Text == "")   //TODO genaue zeichen anzahl prüfen
            {//keine id eingegeben
                MessageBox.Show("Bitte geben Sie in Schritt 1 Ihren Integrations-Code ein. Diesen finden Sie in Ihrer Integrations-Anleitung.",
                    messageboxheadline,
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information,
                    MessageBoxDefaultButton.Button1);
            }
            else
            {
                //snippet holen
                var id = this.textfeld_code.Text;
               
                    //mailtastic ist schon in der signatur vorhanden
                    if (this.oSigFileH.isMailtasticAlreadyInstalled(selectedSignature)) 
                    {
                        MessageBox.Show("Mailtastic ist für diese Signatur bereits integriert. Sie brauchen Mailtastic nur einmalig zu integrieren.",
                              messageboxheadline,
                              MessageBoxButtons.OK,
                              MessageBoxIcon.Information,
                              MessageBoxDefaultButton.Button1);
                    
                }else
                {
                    var snippet = this.bcon.getSnippet(id);
                    if (snippet == null || snippet == "" || !snippet.StartsWith("<a") /*|| !snippet.Contains("app.mailtastic.de")*/)
                    {
                        if (snippet == "NOUSER")
                        {
                            MessageBox.Show("Der eingegebene Integrations-Code war nicht korrekt. Bitte kopieren Sie den Integrations-Code aus Ihrer Integrationsanleitung, um Fehler beim Eingeben zu vermeiden.",
                          messageboxheadline,
                          MessageBoxButtons.OK,
                          MessageBoxIcon.Information,
                          MessageBoxDefaultButton.Button1);
                        }
                        else
                        {
                            MessageBox.Show("Leider ist ein Problem aufgetreten. Bitte stellen Sie sicher, dass Sie über eine aktive Internetverbindung verfügen. Falls weiterhin Probleme auftreten sollten, wenden Sie sich bitte an den Support: support@mailtastic.de",
                           messageboxheadline,
                           MessageBoxButtons.OK,
                           MessageBoxIcon.Information,
                           MessageBoxDefaultButton.Button1);
                        }

                    }
                    else {

                        //signatur datei schreiben
                        var success = this.oSigFileH.writeMailtasticSnippetToFile(selectedSignature, snippet);
                        if (success == false)
                        {
                            MessageBox.Show("Die Integration von Mailtastic konnte nicht erfolgreich abgeschlossen werden. Bitte wenden Sie sich an den technischen Support: support@mailtastic.de",
                                  messageboxheadline,
                                  MessageBoxButtons.OK,
                                  MessageBoxIcon.Information,
                                  MessageBoxDefaultButton.Button1);
                        }
                        else
                        {
                            MessageBox.Show("Fertig! Mailtastic wurde in Ihre Signatur integriert. Sie können den Integrations-Assistenten jetzt schließen. Viel Erfolg – Ihr Mailtastic-Team!",
                                  messageboxheadline,
                                  MessageBoxButtons.OK,
                                  MessageBoxIcon.Information,
                                  MessageBoxDefaultButton.Button1);
                        }
                    }
                }

            }
                   
            this.picture_loader.Hide();
            this.button_jetzt_installieren.Show();
            Cursor.Current = Cursors.Default;
        }
    }
}
