import Countdown from 'react-countdown'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { GameStats } from '../../lib/localStorage'
import { shareStatus } from '../../lib/share'
import { tomorrow } from '../../lib/words'
import { BaseModal } from './BaseModal'
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
} from '../../constants/strings'
import { useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
}: Props) => {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [hasEnteredGiveeaway, setHasEnteredGiveaway] = useState(
    !!localStorage.getItem('enteredGiveaway')
  )
  const [marketingLoading, setMarketingLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('hasPlayedBefore', 'true')
  }, [])

  const submitMarketing = async () => {
    if (email.indexOf('@') === -1 || email.length < 5) {
      alert('Please enter a valid email address')
      return
    }

    if (fullName.trim().split(' ').length < 2) {
      alert('Please enter your full name')
      return
    }

    setMarketingLoading(true)

    localStorage.setItem('enteredGiveaway', 'true')

    await fetch('https://api.joinstepladder.com/users/apprentice', {
      method: 'POST',
      body: JSON.stringify({
        email,
        fullName,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    setHasEnteredGiveaway(true)

    setMarketingLoading(false)

    return true
  }

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={() => {
        if (hasEnteredGiveeaway) {
          handleClose()
        } else {
          alert('Please enter your details to have unlimited goes')
        }
      }}
    >
      {hasEnteredGiveeaway && (
        <div
          style={{
            borderRadius: '5px',
            backgroundColor: '#f1f1f1',
            padding: '10px',
            marginBottom: '35px',
          }}
        >
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => window.location.reload()}
          >
            Click to Play Again
          </button>
        </div>
      )}
      {!hasEnteredGiveeaway && (
        <div
          style={{
            borderRadius: '5px',
            backgroundColor: '#f1f1f1',
            padding: '10px',
            marginBottom: '35px',
          }}
        >
          Enter your email address to play an unlimited amount of times. By
          entering your details, you agree to receive marketing emails from{' '}
          <a href="https://joinstepladder.com">
            <b>StepLadder</b>
          </a>
          .
          <br />
          <br />
          <input
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            value={fullName}
            style={{ width: '100%', padding: '5px' }}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            value={email}
            type="email"
            style={{ width: '100%', padding: '5px' }}
          />
          {marketingLoading ? (
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Submitting..
            </button>
          ) : (
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={submitMarketing}
            >
              Submit
            </button>
          )}
        </div>
      )}
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>

      <Histogram
        gameStats={gameStats}
        numberOfGuessesMade={numberOfGuessesMade}
      />

      {(isGameLost || isGameWon) && (
        <div className="mt-5 sm:mt-6 columns-2 dark:text-white">
          <div>
            <button
              type="button"
              className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={() => {
                window.location.href = 'https://joinstepladder.com?code=wordle'
              }}
              style={{
                backgroundColor: '#46e8bd',
                color: 'white',
                textShadow: '1px 1px #000000',
              }}
            >
              StepLadder
            </button>
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              shareStatus(
                guesses,
                isGameLost,
                isHardMode,
                isDarkMode,
                isHighContrastMode,
                handleShareToClipboard
              )
            }}
          >
            {SHARE_TEXT}
          </button>
        </div>
      )}
    </BaseModal>
  )
}
