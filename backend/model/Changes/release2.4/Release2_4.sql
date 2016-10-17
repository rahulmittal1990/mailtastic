/*
Change name of signature tpl and signatureDAta
*/
ALTER TABLE Signature CHANGE signatureTpl signatureTplToEdit TEXT;
ALTER TABLE Signature CHANGE signatureData signatureDataToEdit TEXT;

/*
Crete signature tpl and signature data rolled out
*/
ALTER TABLE Signature ADD signatureTplRolledOut TEXT;
ALTER TABLE Signature ADD signatureDataRolledOut TEXT;


/*
Move already rolled out signatures to rolled out data
*/
Update Signature set signatureTplRolledOut = signatureTplToEdit, signatureDataRolledOut=signatureDataToEdit 
where lastRollout IS NOT NULL;


/*
add lastOUtlookEasySync datetime to user
*/
ALTER TABLE User ADD lastOutlookEasySync DATETIME;