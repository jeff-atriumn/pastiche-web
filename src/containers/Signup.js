import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import {
  // Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  // Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";

export default function Signup() {
  const history = useHistory();

  const [firstFocus, setFirstFocus] = React.useState(false);
  const [lastFocus, setLastFocus] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);
  const [confirmFocus, setConfirmFocus] = React.useState(false);

  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    givenName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    termsAndConditions: false,
  });

  React.useEffect(() => {
    document.body.classList.add("signup-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("signup-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  function validateForm() {
    return (
      fields.givenName.length > 0 &&
      fields.lastName.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
      // fields.termsAndConditions === true
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          given_name: fields.givenName,
          family_name: fields.lastName,
        },
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <>
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" md="6" lg="4">
              <div className="info info-horizontal">
                <div className="icon icon-info">
                  <i className="now-ui-icons media-2_sound-wave"></i>
                </div>
                <div className="description">
                  <h5 className="info-title">Marketing</h5>
                  <p className="description">
                    We've created the marketing campaign of the website. It was
                    a very interesting collaboration.
                  </p>
                </div>
              </div>
              <div className="info info-horizontal">
                <div className="icon icon-info">
                  <i className="now-ui-icons media-1_button-pause"></i>
                </div>
                <div className="description">
                  <h5 className="info-title">Fully Coded in React 16</h5>
                  <p className="description">
                    We've developed the website with React 16 and CSS3. The
                    client has access to the code using GitHub.
                  </p>
                </div>
              </div>
              <div className="info info-horizontal">
                <div className="icon icon-info">
                  <i className="now-ui-icons users_single-02"></i>
                </div>
                <div className="description">
                  <h5 className="info-title">Built Audience</h5>
                  <p className="description">
                    There is also a Fully Customizable CMS Admin Dashboard for
                    this product.
                  </p>
                </div>
              </div>
            </Col>
            <Col className="mr-auto" md="6" lg="4">
              <Card className="card-signup">
                <Form onSubmit={handleSubmit}>
                  <CardBody>
                    <CardTitle className="text-center" tag="h4">
                      Register
                    </CardTitle>
                    <InputGroup
                      className={firstFocus ? "input-group-focus" : ""}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="First Name"
                        type="text"
                        id="givenName"
                        value={fields.givenName}
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        onChange={handleFieldChange}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={lastFocus ? "input-group-focus" : ""}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Last Name"
                        type="text"
                        id="lastName"
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                        value={fields.lastName}
                        onChange={handleFieldChange}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={emailFocus ? "input-group-focus" : ""}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_email-85"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        id="email"
                        value={fields.email}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={handleFieldChange}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={passwordFocus ? "input-group-focus" : ""}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        id="password"
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        value={fields.password}
                        onChange={handleFieldChange}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={confirmFocus ? "input-group-focus" : ""}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        onFocus={() => setConfirmFocus(true)}
                        onBlur={() => setConfirmFocus(false)}
                        value={fields.confirmPassword}
                        onChange={handleFieldChange}
                      ></Input>
                    </InputGroup>
                    {/* <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          defaultChecked={fields.termsAndConditions}
                          onChange={handleFieldChange}
                        ></Input>
                        <span className="form-check-sign"></span>I agree to the
                        terms and{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          conditions
                        </a>
                        .
                      </Label>
                    </FormGroup> */}
                    <CardFooter className="text-center">
                      <LoaderButton
                        block
                        className="btn-round"
                        color="info"
                        isLoading={isLoading}
                        type="submit"
                        disabled={!validateForm()}
                        size="lg"
                      >
                        Get Started
                      </LoaderButton>
                    </CardFooter>
                  </CardBody>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
