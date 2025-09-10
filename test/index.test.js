const request = require("supertest");
const express = require("express");
const app = require("../app");

describe("Messaging Service Endpoints", () => {
  test("prelim: server ping", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("1. Send SMS", async () => {
    const res = await request(app).post("/api/messages/sms").send({
      from: "+12016661234",
      to: "+18045551234",
      type: "sms",
      body: "Hello! This is a test SMS message.",
      attachments: null,
      timestamp: "2024-11-01T14:00:00Z",
    });

    expect(res.statusCode).toBe(201);
  });

  test("2. Send MMS", async () => {
    const res = await request(app)
      .post("/api/messages/sms")
      .send({
        from: "+12016661234",
        to: "+18045551234",
        type: "mms",
        body: "Hello! This is a test MMS message with attachment.",
        attachments: ["https://example.com/image.jpg"],
        timestamp: "2024-11-01T14:00:00Z",
      });
    expect(res.status).toBe(201);
  });

  test("3. Send Email", async () => {
    const res = await request(app)
      .post("/api/messages/email")
      .send({
        from: "user@usehatchapp.com",
        to: "contact@gmail.com",
        body: "Hello! This is a test email message with <b>HTML</b> formatting.",
        attachments: ["https://example.com/document.pdf"],
        timestamp: "2024-11-01T14:00:00Z",
      });
    expect(res.status).toBe(201);
  });

  test("4. Incoming SMS webhook", async () => {
    const res = await request(app).post("/api/webhooks/sms").send({
      from: "+18045551234",
      to: "+12016661234",
      type: "sms",
      messaging_provider_id: "message-1",
      body: "This is an incoming SMS message",
      attachments: null,
      timestamp: "2024-11-01T14:00:00Z",
    });
    expect(res.status).toBe(201);
  });

  test("5. Incoming MMS webhook", async () => {
    const res = await request(app)
      .post("/api/webhooks/sms")
      .send({
        from: "+18045551234",
        to: "+12016661234",
        type: "mms",
        messaging_provider_id: "message-2",
        body: "This is an incoming MMS message",
        attachments: ["https://example.com/received-image.jpg"],
        timestamp: "2024-11-01T14:00:00Z",
      });
    expect(res.status).toBe(201);
  });

  test("6. Incoming Email webhook", async () => {
    const res = await request(app)
      .post("/api/webhooks/email")
      .send({
        from: "contact@gmail.com",
        to: "user@usehatchapp.com",
        xillio_id: "message-3",
        body: "<html><body>This is an incoming email with <b>HTML</b> content</body></html>",
        attachments: ["https://example.com/received-document.pdf"],
        timestamp: "2024-11-01T14:00:00Z",
      });
    expect(res.status).toBe(201);
  });

  test("7. Get conversations", async () => {
    const res = await request(app).get("/api/conversations");
    expect(res.status).toBe(200);

    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("8. Get messages for conversation", async () => {
    const res = await request(app).get("/api/conversations/1/messages");
    expect(res.status).toBe(200);
  });
});
