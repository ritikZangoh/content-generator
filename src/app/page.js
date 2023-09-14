'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const [typeOfContent, setTypeOfContent] = useState('')
  const [message, setMessage] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [responceMessage, setResponceMessage] = useState('')
  const [paidStatus, setPaidStatus] = useState(true) // State for billing status
  const [readOnly, setReadOnly] = useState(false) // State for readonly

  const searchParams = useSearchParams()

  const fontFamily = searchParams.get('fontfamily')
  const textColor = searchParams.get('textcolor')
  const buttonColor = searchParams.get('buttoncolor')
  const fontWeight = searchParams.get('fontweight')
  const buttonWeight = searchParams.get('buttonweight')
  const width = searchParams.get('width')
  const height = searchParams.get('height')
  const modalID = searchParams.get('key')

  // To set the readOnly state
  useEffect(() => {
    setReadOnly(searchParams.get('modaltype') === 'read' ? true : false)
    intializeChatBot();
  }, [])

  // To change state to unpaid
  useEffect(() => {
    setBillingMessage()
  }, [paidStatus])

  // To update char count of message
  useEffect(() => {
    setCharCount(message.length)
  }, [message])

  // Change state when bill is unpaid
  function setBillingMessage() {
    if (!paidStatus) {
      setResponceMessage(
        'Hey! This AI modal is having trouble, this is typically due to a billing issue. Please contact your site administrator for more info.',
      )
      setReadOnly(true)
    }
  }

  // To get billing status of user
  async function intializeChatBot() {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/intialize_chatbot', {
        method: 'POST',
        body: JSON.stringify({ modalId: modalID }),
      })
      const responseData = await response.json()

      if (response.status == 200) {
        setPaidStatus(responseData.paid)
        setTypeOfContent(responseData.contentType);
      }
    } catch (error) {
      console.error('Error:', error)
      // Handle errors here
    }
  }

  // To handle the generate content
  async function handleGenerateContent() {
    if (!message) message

    try {
      const responce = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/handle_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modalId: modalID, msg: message }),
      })

      const responceData = await responce.json()

      if (responce.status === 200) {
        setResponceMessage(responceData.msg)
      } else {
        setResponceMessage(responceData.error)
      }
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ fontFamily: fontFamily }}
    >
      <div
        className={`w-[491px] shadow-md rounded-xl px-6 py-5`}
        style={{ width: width + 'px', height: height + 'px' }}
      >
        <div className="relative">
          <h2
            className="text-[14px] font-bold mt-6 text-[#16192C]"
            style={{ color: '#' + textColor, fontWeight: fontWeight }}
          >
            Tell me what to {typeOfContent}
          </h2>
          <span className="text-[12px] text-[#868686] absolute top-0 right-0">
            {charCount}/2048
          </span>

          <input
            className="w-full bg-[#F2F2F2] mt-[10px] px-[18px] py-3 rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            required
            maxLength="2048"
          />

          <button
            onClick={handleGenerateContent}
            className="mt-5 w-full text-white bg-primary-dark p-3 rounded-lg"
            style={{
              fontWeight: buttonWeight,
              background: '#' + buttonColor,
              opacity: paidStatus ? '1' : '0.5',
            }}
          >
            Generate
          </button>

          <h2
            className="text-[14px] font-bold mt-6 text-[#16192C]"
            style={{ color: '#' + textColor, fontWeight: fontWeight }}
          >
            Here is your generated content
          </h2>

          <textarea
            className="w-full bg-[#F2F2F2] mt-[10px] px-[10px] py-2 rounded-md text-[#425466] font-light overflow-scroll"
            name=""
            id=""
            cols="30"
            rows="3"
            disabled={readOnly}
            style={{ background: readOnly ? 'white' : '#F2F2F2' }}
            value={responceMessage}
            onChange={(e) => setResponceMessage(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  )
}
