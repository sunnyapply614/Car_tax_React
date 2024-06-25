import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { notification } from "antd";
import { getCountries } from "../../utils/cityfunc";
import { signInUser, verifyEmail } from "../../services/axios";

import { SET_USER } from "../../redux/store/types";
import { getDevices } from "../../redux/actions/devices";

import {
  getResponse,
  userRegister,
  resendVerifyEmail,
} from "../../services/axios";
// import { CountryData } from "../../utils/mockup";
import "./style.css";

const Signup = () => {
  const CountryData = getCountries();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [fname, setFname] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameValid, setUserNameValid] = useState(false);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fade, setFade] = useState(false);
  const [isMailSended, setIsMailSended] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [isInvalied, setIsInvalied] = useState({
    fName: { status: false, message: "" },
    uName: { status: false, message: "" },
    mNum: { status: false, message: "" },
    email: { status: false, message: "" },
    city: { status: false, message: "" },
    password: { status: false, message: "" },
    cpassword: { status: false, message: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userName && !userNameValid) {
      setIsInvalied({
        ...isInvalied,
        uName: {
          status: true,
          message: "User Name not available",
        },
      });
    }
  }, [userName, userNameValid]);


  useEffect(() => {
    const func = debounce(async () => {
      var temp = [];
      if (city) {
        let count = 0;
        let maxCount = 1000;
        let issame = false;
        for (let i = 0; i < CountryData.length; i++) {
          if (
            (
              CountryData[i].city +
              ", " +
              CountryData[i].country
            ).toLowerCase() === city.toLowerCase()
          )
            issame = true;
          if (
            (CountryData[i].city + ", " + CountryData[i].country)
              .toLowerCase()
              .startsWith(city.toLowerCase())
          ) {
            temp.push({
              state: CountryData[i].city,
              country: CountryData[i].country,
            });
            count++;
          }
          if (count > maxCount) {
            break;
          }
        }
        if (issame) {
          setSuggestions([]);
        } else {
          setSuggestions(temp);
        }
      } else {
        setSuggestions([]);
      }

      setFade(false);
    }, 1000);

    func();

    if (city) setFade(true);
    return () => {
      func.cancel();
    };
  }, [city]);

  useEffect(() => {
    const validatieUserName = debounce(async () => {
      if (userName) {
        var response = await getResponse("/auth/validateUserName", "post", {
          userName,
        });
        console.log(response);
        if (response && response.status === 200) {
          setUserNameValid(response.data);
          setIsInvalied({
            ...isInvalied,
            uName: {
              status: !response.data,
              message: "User Name Not Available",
            },
          });
        }
      }
    }, 1500);

    validatieUserName();

    return () => {
      validatieUserName.cancel();
    };
  }, [userName]);

  const resendMail = async (email) => {
    const result = await resendVerifyEmail({ email });
    if (result) {
      notification.success({
        placement: "topRight",
        description: "Email verification was sent.",
        duration: 3,
      });
    } else {
      notification.error({
        placement: "topRight",
        description: "Email verification was not sent.",
        duration: 3,
      });
    }
    setFade(false);
  };

  const signUp = async () => {
    setFade(true);
    const registerData = {
      fname: fname,
      userName: userName,
      email: email,
      password: password,
      phone: phone,
      city: city,
    };

    const invaild = {
      fName: { status: false, message: "" },
      uName: { status: false, message: "" },
      mNum: { status: false, message: "" },
      email: { status: false, message: "" },
      city: { status: false, message: "" },
      password: { status: false, message: "" },
      cpassword: { status: false, message: "" },
    };
    let total_flag = false;
    if (password.length < 6) {
      invaild.password.status = true;
      invaild.password.message = "Password is required";
      total_flag = true;
    } else {
      if (cpassword === "") {
        invaild.cpassword.status = true;
        invaild.cpassword.message = "Confirm Password is requierd";
        total_flag = true;
      } else {
        if (cpassword !== password) {
          invaild.cpassword.status = true;
          invaild.cpassword.message = "Password Not Matching";
          total_flag = true;
        }
      }
    }

    if (fname === "") {
      invaild.fName.status = true;
      invaild.fName.message = "First Name is required";
      total_flag = true;
    }
    if (userName === "") {
      invaild.uName.status = true;
      invaild.uName.message = "User Name is required";
      total_flag = true;
    }
    if (city === "") {
      invaild.city.status = true;
      invaild.city.message = "City Name is required";
      total_flag = true;
    }
    if (phone === "") {
      invaild.mNum.status = true;
      invaild.mNum.message = "Phone Number is required";
      total_flag = true;
    }
    if (email === "") {
      console.log("ggggggggggg");
      invaild.email.status = true;
      invaild.email.message = "Email is required";
      total_flag = true;
    }

    if (!total_flag) {
      var data = await userRegister(registerData);
      if (data?.status === 200) {
        notification.success({
          placement: "topRight",
          description: "Welcome to out service!",
          duration: 3,
        });
        setIsMailSended(true);
      } else {
        notification.error({
          placement: "topRight",
          description: "Email verification was not sent.",
          duration: 3,
        });
      }
    } else {
      setIsInvalied(invaild);
    }
    setFade(false);
  };

  const signIn = async () => {
    try {
      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      function validateEmail(email) {
        return emailRegex.test(email);
      }

      var isEmail = validateEmail(email);
      let signInData;
      if (isEmail) {
        signInData = {
          type: "email",
          userId: email,
          password: password,
        };
      } else {
        signInData = {
          type: "id",
          userId: email,
          password: password,
        };
      }

      var res = await signInUser(signInData);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.user.role);
        dispatch({
          type: SET_USER,
          payload: res.data,
        });
        dispatch(getDevices({ token: res.data.token }));
      } else {
        setErrorMsg("Username or password is wrong!");
      }
      setFade(false);
    } catch (err) {
      console.log("🚀 ~ file: Login.js:59 ~ signIn ~ err:", err);
    }
  };

  return (
    <div className="auth" id="auth">
      <div className="auth-left col-md-8 px-0">
        <img src="./assets/log.png" alt="logo" />
      </div>
      <div className="auth-right col-md-4 px-0 py-4">
        <img
          className="mb-5 main-logo"
          src="./assets/mainLogo.svg"
          alt="main-logo"
        />
        <div className="sub1-auth-right">
          <div className="main-form d-flex justify-content-center align-items-center">
            <div className="subsub1-sub1-auth-right">
              {!isMailSended && (
                <>
                  <h3>SignUp</h3>

                  {isInvalied.fName.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">
                        {isInvalied.fName.message}
                      </div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4">
                    <img src="./assets/logname.svg" alt="none" />
                    <input
                      placeholder="First Name"
                      type="text"
                      onChange={(e) => {
                        setFname(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          fName: { status: false, message: "" },
                        });
                      }}
                    />
                  </div>
                  {isInvalied.uName.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">
                        {isInvalied.uName.message}
                      </div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4 position-relative">
                    <img src="./assets/logUser.svg" alt="none" />
                    <input
                      placeholder="Username"
                      type="text"
                      onChange={(e) => {
                        setUserName(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          uName: { status: false, message: "" },
                        });
                      }}
                    />
                    {userName && userNameValid && (
                      <img
                        className="my-auto position-absolute mr-0"
                        src={"./assets/valid.svg"}
                        style={{
                          width: "1.8rem",
                          right: "0.5rem",
                          bottom: "0.7rem",
                        }}
                        alt="none"
                      />
                    )}
                  </div>
                  {isInvalied.email.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">
                        {isInvalied.email.message}
                      </div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4">
                    <img src="./assets/logmail.svg" alt="none" />
                    <input
                      placeholder="Email"
                      type="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          email: { status: false, message: "" },
                        });
                      }}
                    />
                  </div>
                  {isInvalied.mNum.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">{isInvalied.mNum.message}</div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4">
                    <img src="./assets/logmobile.svg" alt="none" />
                    <input
                      placeholder="Mobile Number"
                      type="number"
                      onChange={(e) => {
                        setMobile(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          mNum: { status: false, message: "" },
                        });
                      }}
                    />
                  </div>
                  {isInvalied.city.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">{isInvalied.city.message}</div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4 position-relative city">
                    <img src="./assets/logcity.svg" alt="none" />
                    <input
                      autoComplete="new-password"
                      placeholder="City"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          city: { status: false, message: "" },
                        });
                      }}
                    />
                    {city && (
                      <div className="suggestion position-absolute w-100 px-3 overflow-y-auto">
                        {suggestions.map((cityData, index) => (
                          <p
                            className="my-1 cursor-pointer"
                            key={index}
                            onClick={() => {
                              setSuggestions([]);
                              setCity(cityData.state + ", " + cityData.country);
                            }}
                          >
                            {cityData.state + ", " + cityData.country}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {isInvalied.password.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box">
                        {isInvalied.password.message}
                      </div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4">
                    <img src="./assets/logLock.svg" alt="none" />
                    <input
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          password: { status: false, message: "" },
                        });
                      }}
                    />
                  </div>
                  {isInvalied.cpassword.status && (
                    <div
                      className="input-container d-flex mb-2"
                      style={{ borderBottom: "0px", height: "0px" }}
                    >
                      <div className="error-box"
                      style={{ left: "230px" }}
                      >
                        {isInvalied.cpassword.message}
                      </div>
                    </div>
                  )}
                  <div className="input-container d-flex mb-4">
                    <img src="./assets/logLock.svg" alt="none" />
                    <input
                      placeholder="Confirm Password"
                      type="password"
                      onChange={(e) => {
                        setCpassword(e.target.value);
                        setIsInvalied({
                          ...isInvalied,
                          cpassword: { status: false, message: "" },
                        });
                      }}
                    />
                  </div>

                  <button
                    className="py-1"
                    onClick={() => {
                      setFade(true);
                      signUp();
                    }}
                  >
                    {!fade ? (
                      "SignUp"
                    ) : (
                      <img
                        src="./assets/loading.gif"
                        class="imgloading"
                        alt="none"
                      />
                    )}
                  </button>
                  <span className="have-account">
                    Already have account!{" "}
                    <p
                      style={{
                        textDecoration: "underLine",
                        fontSize: "2rem",
                        display: "inline",
                      }}
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Login
                    </p>
                  </span>
                </>
              )}
              {isMailSended && (
                <div className="resend-email">
                  <h3>SingUp SuccessFully</h3>
                  <p style={{ fontSize: 16, color: "#28A745" }}>
                    Verification Email has been sent to below registered Email
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      color: "#ffffff",
                      borderBottom: "1px solid #ffffff",
                    }}
                  >
                    {email}
                  </p>
                  <button
                    className="py-1"
                    onClick={() => {
                      setFade(true);
                      resendMail(email);
                    }}
                  >
                    {!fade ? (
                      "Resend Email"
                    ) : (
                      <img
                        src="./assets/loading.gif"
                        class="imgloading"
                        alt="none"
                      />
                    )}
                  </button>
                  <button
                    className="py-1"
                    onClick={() => {
                      signIn();
                      setFade(false);
                    }}
                  >
                    {!fade ? (
                      "Login"
                    ) : (
                    <img
                      src="./assets/loading.gif"
                      className="imgloading"
                      alt="none"
                    />
                )}
              </button>
                </div>
              )}
            </div>
          </div>
          {!isMailSended && (
            <div className="subsub2-sub1-auth-right mt-5">
              <a href="https://www.google.com" target="_blank" rel="noreferrer">
                <img
                  src="./assets/Google.svg"
                  alt="none"
                  style={{ width: "12.6rem", height: "4.4rem" }}
                />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="./assets/Facebook.svg"
                  alt="none"
                  style={{
                    width: "12.6rem",
                    height: "4.4rem",
                    marginLeft: "1rem",
                  }}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
