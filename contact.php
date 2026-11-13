<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// 1. Anti-Bot Honeypot check
if (!empty($_POST['website_hp'])) {
    // Return success to confuse bots without sending mail
    echo json_encode(['success' => true, 'message' => 'Message received.']);
    exit;
}

// 2. Simple Rate Limiting (1 request per 15 seconds per IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateFile = sys_get_temp_dir() . '/ob_rl_' . md5($ip);
if (file_exists($rateFile) && (time() - filemtime($rateFile)) < 15) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait a moment before sending again.']);
    exit;
}
@touch($rateFile);

// 3. Sanitize inputs
$name    = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
$email   = trim($_POST['email'] ?? '');
$phone   = htmlspecialchars(strip_tags(trim($_POST['phone'] ?? '')));
$service = htmlspecialchars(strip_tags(trim($_POST['service'] ?? 'General Consultation')));
$budget  = htmlspecialchars(strip_tags(trim($_POST['budget'] ?? 'Not specified')));
$subject = htmlspecialchars(strip_tags(trim($_POST['subject'] ?? 'Website Inquiry')));
$message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

// 4. Validate required fields
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields (Name, Email, Message).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// 5. Build Email Content
$to           = 'info@orchidbyte-solutions.com.ng';
$emailSubject = 'OrchidByte Consultation: ' . ($subject !== '' ? $subject : $service);

$body  = "========================================================\n";
$body .= "  NEW ENTERPRISE INQUIRY - ORCHIDBYTE SOLUTIONS\n";
$body .= "========================================================\n\n";
$body .= "Client Name:      $name\n";
$body .= "Email Address:    $email\n";
$body .= "Phone / WhatsApp: " . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= "Service Domain:   $service\n";
$body .= "Estimated Budget: $budget\n";
$body .= "Subject:          $subject\n";
$body .= "Timestamp (UTC):  " . gmdate('Y-m-d H:i:s') . "\n";
$body .= "Client IP:        $ip\n\n";
$body .= "------------------- PROJECT BRIEF -------------------\n";
$body .= $message . "\n";
$body .= "-----------------------------------------------------\n\n";
$body .= "OrchidByte Solutions & General Services (BN: 9343571)\n";
$body .= "Kano, Nigeria | https://orchidbyte-solutions.com.ng\n";

$headers  = "From: OrchidByte Portal <noreply@orchidbyte-solutions.com.ng>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (@mail($to, $emailSubject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message transmitted successfully. A lead engineer will respond within 24 hours.']);
} else {
    // If local PHP mail is unconfigured on dev server, return clean status
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Mail delivery could not complete automatically. Please reach us immediately via WhatsApp or direct email at info@orchidbyte-solutions.com.ng'
    ]);
}
