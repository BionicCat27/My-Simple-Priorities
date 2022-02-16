import React, { useState } from "react";

import './ReviewCard.css';

const ReviewCard = (props) => {
    const [showButtons, setShowButtons] = useState(false);
    const [editingReview, setEditingReview] = useState(false);
    const [reviewTitleValue, setReviewTitleValue] = useState(props.title);
    const [reviewDescriptionValue, setReviewDescriptionValue] = useState(props.description);
    const [reviewProgressValue, setReviewProgressValue] = useState(props.progress);
    const [reviewTitleInputValue, setReviewTitleInputValue] = useState(props.title);
    const [reviewDescriptionInputValue, setReviewDescriptionInputValue] = useState(props.description);
    const [reviewProgressInputValue, setReviewProgressInputValue] = useState(props.progress);

    function moveReviewUp() {
        let currentIndex = props.reviewIndex;
        props.moveReview(currentIndex, currentIndex - 1);
    }

    function moveReviewDown() {
        let currentIndex = props.reviewIndex;
        props.moveReview(currentIndex, currentIndex + 1);
    }

    function deleteReview() {
        props.deleteReview(props.reviewIndex);
    }

    function updateReviewTitleInput(value) {
        setReviewTitleInputValue(value);
    }

    function updateReviewDescriptionInput(value) {
        setReviewDescriptionInputValue(value);
    }

    function updateReviewProgressInput(value) {
        setReviewProgressInputValue([value]);
    }

    function updateReview() {
        validateValues();
        setReviewTitleValue(reviewTitleInputValue);
        setReviewDescriptionValue(reviewDescriptionInputValue);
        setReviewProgressValue([reviewProgressInputValue]);
        setEditingReview(false);
        let value = {
            title: reviewTitleInputValue,
            description: reviewDescriptionInputValue,
            progress: reviewProgressValue
        };
        props.updateReview(props.reviewIndex, value);
    }

    function validateValues() {
        if (reviewTitleValue == undefined) {
            setReviewTitleValue("");
        }
        if (reviewDescriptionValue == undefined) {
            setReviewDescriptionValue("");
        }
        if (reviewTitleInputValue == undefined) {
            setReviewTitleInputValue("");
        }
        if (reviewDescriptionInputValue == undefined) {
            setReviewDescriptionInputValue("");
        }
        if (reviewProgressValue == undefined || reviewProgressValue == []) {
            setReviewProgressValue([]);
        }
        if (reviewProgressInputValue == undefined) {
            setReviewProgressInputValue("");
        }
    }

    validateValues();
    //console.log(`${reviewTitleValue}: (${reviewProgressValue}) == ${reviewProgressValue.length}`);

    if (editingReview) {
        return (
            <div id="reviewCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
                <div id="reviewContainer">
                    <label htmlFor="reviewTitleInputValue">Title</label>
                    <input id="reviewTitleInputValue" className="margin-y-1" onChange={field => updateReviewTitleInput(field.target.value)} value={reviewTitleInputValue}></input>
                    <label htmlFor="reviewDescriptionInputValue">Description</label>
                    <textarea id="reviewDescriptionInputValue" className="margin-y-1" onChange={field => updateReviewDescriptionInput(field.target.value)} value={reviewDescriptionInputValue}></textarea>
                    <label htmlFor="reviewProgressInputValue">Progress</label>
                    <input id="reviewProgressInputValue" className="margin-y-1" type="number" max="100" onChange={field => updateReviewProgressInput(field.target.value)} value={reviewProgressInputValue}></input>
                </div>
                <div id="reviewButtonContainer" className="button-block">
                    <button className="review-button" onClick={updateReview}>Done</button>
                </div>
            </div>
        );
    }
    return (
        <div id="reviewCard" onMouseEnter={() => setShowButtons(true)} onMouseLeave={() => setShowButtons(false)}>
            <div id="reviewContainer">
                <h3 onClick={() => setEditingReview(true)}>{reviewTitleValue}</h3>
                {reviewDescriptionValue && <p>{reviewDescriptionValue}</p>}
                {reviewProgressValue > 0 && <p>{reviewProgressValue}%</p>}
            </div>
            {showButtons &&
                <div id="reviewButtonContainer" className="button-block">
                    {editingReview
                        ? <button className="review-button" onClick={updateReview}>Done</button>
                        : <div>
                            <button className="review-button" onClick={() => setEditingReview(true)}>Edit</button>
                            <button className="review-button" onClick={moveReviewUp}>Up</button>
                            <button className="review-button" onClick={moveReviewDown}>Down</button>
                            <button className="review-button" onClick={deleteReview}>Delete</button>
                        </div>
                    }
                </div>
            }
        </div >
    );
};

export default ReviewCard;