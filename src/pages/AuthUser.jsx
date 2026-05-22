import { useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card, InputGroup, } from "react-bootstrap";

import { Link } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // React Bootstrap icons

const AuthUser = () => {
  const emailInputRef = useRef(null);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const handleFocus = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocusPass = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="shadow-lg border-0"
          style={{ maxWidth: "900px", width: "100%", borderRadius: "15px" }}
        >
          <Row className="g-0">
            <Col
              md={6}
              className="d-flex flex-column align-items-center justify-content-center text-center p-4"
              style={{
                backgroundColor: "#dcfaef",
                borderTopLeftRadius: "15px",
                borderBottomLeftRadius: "15px",
              }}
            >
              <Link to="/">
                <img
                  src="/images/logo.svg"
                  loading="lazy" alt="Logo"
                  style={{ height: "40px" }}
                />
              </Link>
              <h3 className="fw-bold">Welcome to Zyvo</h3>
              <p className="text-muted" style={{ fontSize: "14px" }}>
                Enter your phone number to Login to your account.
              </p>
            </Col>

            <Col md={6} className="p-5">
              <h3 className="fw-bold text-center">
                ZYVO <span style={{ color: "#a1f794" }}>AUTH</span>
              </h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup
                    style={{
                      border: isFocusedEmail
                        ? "1px solid #007bff"
                        : "1px solid #ced4da",
                      borderRadius: "30px",
                      overflow: "hidden",
                      transition: "border 0.2s ease-in-out",
                    }}
                  >
                    <InputGroup.Text
                      onClick={handleFocus}
                      style={{
                        cursor: "pointer",
                        background: "white",
                        border: "none",
                        padding: "10px",
                      }}
                    >
                      <img
                        src="/images/popups/mail-input.svg"
                        loading="lazy" alt="User Icon"
                        width="20"
                      />
                    </InputGroup.Text>
                    <Form.Control
                      ref={emailInputRef}
                      type="email"
                      placeholder="Enter your email"
                      onFocus={() => setIsFocusedEmail(true)}
                      onBlur={() => setIsFocusedEmail(false)}
                      style={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup
                    style={{
                      border: isFocused
                        ? "1px solid #007bff"
                        : "1px solid #ced4da",
                      borderRadius: "30px",
                      overflow: "hidden",
                      transition: "border 0.2s ease-in-out",
                    }}
                  >
                    <InputGroup.Text
                      onClick={handleFocusPass}
                      style={{
                        cursor: "pointer",
                        background: "white",
                        border: "none",
                        padding: "10px",
                      }}
                    >
                      <img
                        src="/images/popups/lock-input.svg"
                        loading="lazy" alt="Lock Icon"
                        width="20"
                      />
                    </InputGroup.Text>
                    <Form.Control
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                    />
                    <InputGroup.Text
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        cursor: "pointer",
                        background: "white",
                        border: "none",
                        padding: "10px",
                      }}
                    >
                      {showPassword ? (
                        <EyeSlash size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                  <div className="text-end mt-2">
                    <a href="#" className="text-decoration-none">
                      Forgot password?
                    </a>
                  </div>
                </Form.Group>

                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "35px",
                  }}
                >
                  <Button
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "0",
                      backgroundColor: "rgb(74, 234, 177)",
                      borderRadius: "50px",
                    }}
                  >
                    Login
                  </Button>
                </div>
                <div className="text-center mt-3">-OR-</div>
                <div className="text-center mt-3">Login With</div>
                <div>
                  <ul
                    className="list-unstyled d-flex"
                    style={{
                      listStyle: "none",
                      padding: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f7f7f7",
                      margin: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                    }}
                  >
                    {["google", "facebook", "apple", "mail"].map((provider) => (
                      <div
                        key={provider}
                        style={{
                          height: "50px",
                          width: "50px",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "0",
                        }}
                      >
                        <img
                          src={`/images/popups/${provider}.svg`}
                          alt={`${provider} Login`}
                          width="30px"
                          height="30px"
                        />
                      </div>
                    ))}
                  </ul>
                </div>
                <div className="text-center mt-3">
                  Are you new?{" "}
                  <a href="#" className="text-decoration-none">
                    Create an Account
                  </a>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default AuthUser;
