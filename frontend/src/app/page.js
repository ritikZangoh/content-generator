/**
 * Content Generation Next Page
 * 
 * This page is designed to be used as part of a web application that allows users to embed in their website for generate content dynamically.
 * It includes features like character count, billing status, and customization options.
 * 
 * @component
*/
'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ClipLoader from 'react-spinners/ClipLoader'
import { Icon } from '@iconify/react'
import { DM_Sans, Montserrat, Poppins, Inter } from 'next/font/google'

const dmFont = DM_Sans({ subsets: [] })
const monsterrat = Montserrat({ subsets: [] })
const poppins = Poppins({ subsets: [],
weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']})
const inter = Inter({ subsets: [] })

export default function Home() {
  // State variables to manage various aspects of the component
  const [typeOfContent, setTypeOfContent] = useState('')
  const [message, setMessage] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseWordCount, setResponseWordCount] = useState(0)
  const [paidStatus, setPaidStatus] = useState(true) // State for billing status
  const [readOnly, setReadOnly] = useState(false) // State for readonly
  const [loading, setLoading] = useState(false)
  const [waitForResponse, setWaitForResponce] = useState(false)
  const [validKey, setValidKey] = useState(true);
  const [fontStyle, setFontStyle] = useState(dmFont);
  const [rows, setRows] = useState(1);

  // Retrieve query parameters from the URL
  const searchParams = useSearchParams()

  let fontFamily = searchParams.get('fontfamily')
  const textColor = searchParams.get('textcolor')
  const buttonColor = searchParams.get('buttoncolor')
  const fontSize = searchParams.get('fontsize')
  const fontWeight = searchParams.get('fontweight')
  const buttonWeight = searchParams.get('buttonweight')
  const width = searchParams.get('width')
  const height = searchParams.get('height')
  const modalID = searchParams.get('key')

  // To set the readOnly state
  useEffect(() => {
    setReadOnly(searchParams.get('modaltype') === 'read' ? true : false)
    initializeChatBot()
  }, [])

  // To update status of billing
  useEffect(() => {
    updateBillingStatus()
  }, [paidStatus])

  // To update char count of message
  useEffect(() => {
    setCharCount(message.length)
  }, [message])

  // To set font fontFamily
  useEffect(() => {
    if(!fontFamily) {
      setFontStyle(dmFont)
    }
    else if(fontFamily.toLowerCase() === 'monsterrat'){
      setFontStyle(monsterrat)
    }
    else if(fontFamily.toLowerCase() === 'poppins'){
      setFontStyle(poppins)
    }
    else if(fontFamily.toLowerCase() === 'inter'){
      setFontStyle(inter)
    }
  }, [])


  // To set billing status
  function updateBillingStatus() {
    if (!paidStatus) {
      setResponseMessage(
        'Hey! This AI modal is having trouble, this is typically due to a billing issue. Please contact your site administrator for more info.',
      )
      setReadOnly(true)
    }
  }

  // To get billing status of user
  async function initializeChatBot() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/initialize_chatbot',
        {
          method: 'POST',
          headers: {
            'AuthKey': process.env.NEXT_PUBLIC_AUTHKEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ modalId: modalID }),
        },
      )
      const responseData = await response.json()

      if (response.status == 200) {
        let paid = responseData.paid == 0 ? false : true
        setPaidStatus(paid)
        console.log(responseData)
        setTypeOfContent(responseData.contentType)
        if(responseData.response == 'None') setValidKey(false);
      }
    } catch (error) {
      // Handle errors here
      console.error('Error:', error)

    }
  }

  // To handle the generate content
  async function handleGenerateContent() {
    if (!message || waitForResponse) return
    setWaitForResponce(true)
    setLoading(true)

    try {
      const responce = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/handle_request',
        {
          method: 'POST',
          headers: {
            'AuthKey': process.env.NEXT_PUBLIC_AUTHKEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ modalId: modalID, msg: message }),
        },
      )

      const responseData = await responce.json()

      if (responce.status === 200) {
        setResponseMessage(responseData.msg)
      } else {
        setResponseMessage(responseData.error)
      }
      setResponseWordCount(responseData.msg.trim().split(/\s+/).length)
    } catch (error) {
      // Handle error here
      console.log('Error: ' + error)
    }

    setLoading(false)
    setWaitForResponce(false)
  }


  // Handle input message
  function handleInput(e){
    const r = e.target.value.split('\n').length;
    setRows(r <= 4? r : 4)
    setMessage(e.target.value)
  }

  // Component render
  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ fontFamily: fontStyle?.style?.fontFamily }}
    >
      {/* Show when key is invalid */}
      {!validKey &&
      <div className="absolute w-full h-full bg-white z-50 top-0 left-0 flex items-center justify-center">
        Invalid key
      </div>
      }
      <div
        className="w-[491px] shadow-md relative rounded-xl px-6 py-5"
        style={{ width: width + 'px', height: height + 'px' }}
      >
        {/* <ClipLoader
          cssOverride={{ position: 'absolute', top: '20px', right: '50%' }}
          loading={loading}
        /> */}
        <div className="relative">
          <h2
            className="text-[14px] font-bold mt-6 text-[#16192C]"
            style={{ color: '#' + textColor, fontWeight: fontWeight, fontSize: fontSize + 'px' }}
          >
            Tell me what to {typeOfContent}
          </h2>
          <span className="text-[12px] text-[#868686] absolute top-0 right-0">
            {charCount}/2048
          </span>

          <textarea
            className="w-full bg-[#F2F2F2] mt-[10px] px-[18px] py-3 rounded-md"
            value={message}
            onChange={handleInput}
            disabled={!paidStatus}
            rows={rows}
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
              fontSize: fontSize + 'px' 
            }}
          >
            Generate
            {loading && (
              <Icon
                className="h-6 w-10 scale-[2] text-purple-600 ml-2 inline-block"
                style=""
                icon="eos-icons:three-dots-loading"
              />
            )}
          </button>

          <h2
            className="text-[14px] font-bold mt-6 text-[#16192C]"
            style={{ color: '#' + textColor, fontWeight: fontWeight, fontSize: fontSize + 'px'  }}
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
            style={{ background: readOnly ? 'white' : '#F2F2F2', fontSize: fontSize }}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          ></textarea>
          <p className="text-xs text-right text-[#868686] mt-1" >
            Words: {responseWordCount}
          </p>
        </div>
      </div>
    </div>
  )
}
