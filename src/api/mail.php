<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    //Load phpmailer()
    require 'vendor/phpmailer/Exception.php';
    require 'vendor/phpmailer/PHPMailer.php';
    require 'vendor/phpmailer/SMTP.php';

    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // defining the credential
    $senderMail = "estiatorio4896@gmail.com";

    // assign the value if there is POST
    // type of the email
    if (isset($_POST['subject'])) {
        $mailSubject = $_POST['subject'];
    }
    // if there is any email submitted
    if (isset($_POST['email'])) {
        $receiverMail = $_POST['email'];
    }
    // if there is full name submitted
    if (isset($_POST['fullName'])) {
        $fullName = $_POST['fullName'];
    }
    // if there is username submitted
    if (isset($_POST['username'])) {
        $username = $_POST['username'];
    }
    // check the status of the boolean
    if (isset($_POST['bool'])) {
        $boolMail = $_POST['bool'];
    }
    // check new password is defined or not
    if (isset($_POST['newPw'])) {
        $newPw = $_POST['newPw'];
    }
    // checking reservation status: 0 = Reserved, 1 = Cancelled, 2 = Penalized
    if (isset($_POST['reservationStatus'])) {
        $reservationStatus = $_POST['reservationStatus'];
    }
    // obtaining the reservation id
    if (isset($_POST['reservationId'])) {
        $reservationId = $_POST['reservationId'];
    }

    //PHPMailer Object
    $mail = new PHPMailer(true); //Argument true in constructor enables exceptions

    // setting the URL link dynamically
    $serverHost = $_SERVER['HTTP_HOST'];
    // if $requestSubject based on the $mailSubject is empty then we won't set URL
    $requestSubject = "/";

    // setting the mail subject specifically based on the given subject
    // 0 = Account registration alert (All)
    // 1 = Activate/Deactivate of the account (User and Admin)
    // 2 = Approving/Disapproving Restaurant Staff account's registration by Admin
    // 3 = Reset Password (Send autogenerated password)
    // 4 = Reservation status (Cancellation, Penalized, Created)
    // 5 = Monthly Report for the restaurant staff at the end of the month
    // 6 = Sign-up for News
    switch($mailSubject) {
        case 0:
            $topic = "Welcome to Estiatorio, " .$fullName. "!";
            $subTopic = "Account Registered";
            $mailContent = "We thank you for your participation in our system and welcome you with open arms!
            <br/><br />Regards, <br/>The Estiatorio Team";
            
            break;
        case 1:
            if ($boolMail == "0") {
                $status = "activated"; 
            } else {
                $status = "deactivated";
            }
            
            $topic = "Notice: Account " . ucfirst($status);
            $subTopic= "Account " . ucfirst($status);
            $mailContent = "You account has been " . strtolower($status) . ". For more information you may contact with the administrator.
            <br/><br />Regards, <br/>The Estiatorio Team";

            break;
        case 2:
            if ($boolMail == true) {
                $status = "approved"; 
            } else {
                $status = "disapproved";
            }

            $topic = "Notice: Your staff account's registration has been " . $status;
            $subTopic = "Staff account's registration request has been " . $status;
            
            $requestSubject = "/login";
            $url = "http://$serverHost$requestSubject";
            
            $mailContent = 
            "Your request on creating a staff account has been " . $status .". "; 
            if ($boolMail == true) {
                $mailContent = $mailContent . "You can now start to use the platform now by login via the link below: 
                    <br />
                <a href='".$url."' style='text-decoration: none; pointer: cursor;'><b>Sign In</b></a>";
            } else {
                $mailContent = $mailContent . "For more information you may contact with the administrator.";
            }
            $mailContent = $mailContent . "
            <br/><br />Regards, <br/>The Estiatorio Team
            "; 
            
            break;
        case 3:
            $topic = "Notice: Reset Password";
            $subTopic = "Request for resetting account's password";
            $mailContent = "
                Your new password: <br />
                <p><b style='font-size: 20px'>" . $newPw . "</b></p><br />
                <p>Please do change your password for maintaining your account's security.</p>
                <br/><br />Regards, <br/>The Estiatorio Team
            ";

            break;
        case 4:
            $formalId = $reservationId;
            // setting the formal ID for the reservation ID: R0001
            if (strlen($reservationId) < 4) {
                // the char number on the reservation ID is lesser than 0001 4 digits, then we will add it via for-loop
                for ($n = 1; $n <= (4 - strlen($reservationId)); $n++) {
                    $formalId = "0" . $formalId;

                    if ($n == (4 - strlen($reservationId))) {
                        $formalId = "R" . $formalId;

                        break;
                    }
                }
            } else {
                $formalId = "R" . $formalId;
            }

            // setting the context the reservation status
            if ($reservationStatus == 0) {
                $statusContext = "reservation attended";
                $mailContext = "Your reservation: " . $formalId . " has been marked as attended. Thank you for attending the reservation on time, we hope you will enjoy your time under our restaurant's care!";
            } else if ($reservationStatus == 1) {
                $statusContext = "reservation reserved";
                $mailContext = "Your reservation: " . $formalId . " has been reserved! Please do take note on the reservation venue and be on time for preventing any possible penalty applied on you.";
            } else if ($reservationStatus == 2) {
                $statusContext = "reservation cancelled and refunded";
                $mailContext = "Your reservation: " . $formalId . " has been cancelled and refunded upon request. Refund may take upon 30 business working days to reach you.";
            } else if ($reservationStatus == 3) {
                $statusContext = "reservation cancelled by system and penalized";
                $mailContext = "Your reservation: " . $formalId . " has been cancelled by the system automatically due to unable to attend the reservation within appointment. The penalty will be applied <b style='color: red;'>by charging your reservation fee by 5% during the refund</b>, as per mentioned by the <b>Term & Conditions</b>.";
            }

            $topic = "Reservation Notice: " . ucfirst($statusContext);
            $subTopic = ucfirst($statusContext);
            $mailContent = $mailContext . "
                <br />
                <br/>Regards, <br/>The Estiatorio Team
            ";

            break;
        case 5:
            // PDF Monthly Report attachment of each restaurant under the restaurant owner/staff

            //do something ...

            break;
        case 6:
            // SQL Query on saving the email into database for sending the news to the subsribed email
            
            $topic = "Estiatorio: News Subscribed";
            $subTopic = "Subscription News";
            $mailContent = "<b style='font-size: 20px'>Dear " . $fullName . "</b>, <br/><br/> Thank you for interested in our Estiatorio platform! We will deliver the latest news to you from now on!
            <br/>
            <br/>Regards, <br/>The Estiatorio Team
            ";

            break;
    }

    // setting up the image src
    $mail->AddEmbeddedImage('../assets/image/brand_logo_01.png', 'logo'); // P.S: Based on the mail.php file directory

    $mailBody = 
    '
    <html class="no-js" lang="en">
        <head> 
            <title>Topic: '.$subTopic.'</title> 
        </head> 
        <body>
            <img src="cid:logo" style="margin-left: 10%; margin-top: 20px; width:200px;">
            <br>
            <h1>'.$topic.'</h1>
            <div>'.$mailContent.'</div>
        </body>
    </html>
    ';

    // defining the credential of the email receiver
    //From email address and name
    $mail->From = $senderMail;
    $mail->FromName = "Estiatorio Corp.";
    $mail->IsSMTP(); 
    $mail->Mailer = "smtp";
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = "tsl";
    $mail->Port = 587; 
    $mail->Username = $senderMail;
    $mail->Password = "joeshern123Abc12"; 
    $mail->SetFrom($senderMail, 'Estiatorio');
    $mail->Subject = $topic;
    $mail->AltBody = ""; 
    $mail->MsgHTML($mailBody);
    $mail->AddAddress($receiverMail);


    try {
        $mail->send();
        // the mail sended succesfully
        echo true;
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    }
?>