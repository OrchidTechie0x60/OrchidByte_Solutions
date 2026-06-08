<?php
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Sanitize inputs
$name    = htmlspecialchars(strip_tags(trim($_POST['name']    ?? '')));
$email   = trim($_POST['email']   ?? '');
$subject = htmlspecialchars(strip_tags(trim($_POST['subject'] ?? 'General Enquiry')));
$message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

// Validate required fields
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Email config
$to           = 'info@orchidbyte-solutions.com';
$emailSubject = 'OrchidByte Contact: ' . ($subject !== '' ? $subject : 'General Enquiry');

$body  = "You have received a new message via the OrchidByte Solutions website contact form.\n\n";
$body .= "-------------------------------------------\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "Subject: $subject\n";
$body .= "-------------------------------------------\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: noreply@orchidbyte-solutions.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $emailSubject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not send message. Please try again or email us directly.']);
}
