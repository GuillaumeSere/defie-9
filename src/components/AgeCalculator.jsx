import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { animated, useSpring } from "react-spring";
import arrow from '../assets/images/icon-arrow.svg'

const AgeCalculator = () => {
    const [age, setAge] = useState({ years: "- -", months: "- -", days: "- -" });
    const [animatedAge, setAnimatedAge] = useSpring(() => ({
        age: 0,
        from: { age: 0 },
        config: { duration: 1000 },
    }));

    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthdateObj = new Date(birthdate);
        let years = today.getFullYear() - birthdateObj.getFullYear();
        let months = today.getMonth() - birthdateObj.getMonth();
        let days = today.getDate() - birthdateObj.getDate();
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        if (days < 0) {
            months--;
            days += new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            ).getDate();
        }
        return { years, months, days };
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const { day, month, year } = values;
        const birthdate = `${year}-${month}-${day}`;
        const age = calculateAge(birthdate);
        setAge(age);
        setAnimatedAge({ age: age.years });
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        day: Yup.number().required().min(1).max(31),
        month: Yup.number().required().min(1).max(12),
        year: Yup.number()
            .required()
            .test("is-future", "Year cannot be in the future", (value) => {
                const currentYear = new Date().getFullYear();
                return value <= currentYear;
            }),
    });


    const validate = (values) => {
        const errors = {};

        if (!values.day) {
            errors.day = "This field is required";
        }

        if (!values.month) {
            errors.month = "This field is required";
        }

        if (!values.year) {
            errors.year = "This field is required";
        }

        return errors;
    };

    return (
        <div className="container">
            <Formik
                initialValues={{ day: "", month: "", year: "" }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                validate={validate}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <div className="form">
                            <div className="day">
                                <label htmlFor="day" className={`${errors.day && touched.day ? 'error' : ''}`}>Day</label>
                                <Field type="number" name="day" id="day" placeholder="DD" className={`input-style ${errors.day && touched.day ? 'error' : ''}`} />
                                {errors.day && touched.day ? (
                                    <div className="error">{errors.day}</div>
                                ) : null}
                            </div>
                            <div className="month">
                                <label htmlFor="month" className={`${errors.month && touched.month ? 'error' : ''}`}>Month</label>
                                <Field type="number" name="month" id="month" placeholder="MM" className={`input-style ${errors.month && touched.month ? 'error' : ''}`} />
                                {errors.month && touched.month ? (
                                    <div className="error">{errors.month}</div>
                                ) : null}
                            </div>
                            <div className="year">
                                <label htmlFor="year" className={`${errors.year && touched.year ? 'error' : ''}`}>Year</label>
                                <Field type="number" name="year" id="year" placeholder="YYYY" className={`input-style ${errors.year && touched.year ? 'error' : ''}`} />
                                {errors.year && touched.year ? (
                                    <div className="error">{errors.year}</div>
                                ) : null}
                            </div>
                            <div className="line"></div>
                            <button type="submit" >
                                <img src={arrow} alt="buttton" />
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
            {age && (
                <div className="result">
                    <span><animated.span>{animatedAge.age.interpolate((x) => age.years === "- -" ? "- -" : Math.floor(x))}</animated.span>
                        <small> years</small></span>
                    <span>{age.months} <small>months</small></span>
                    <span>{age.days} <small>days</small> </span>
                </div>
            )}
        </div>
    );
};

export default AgeCalculator;