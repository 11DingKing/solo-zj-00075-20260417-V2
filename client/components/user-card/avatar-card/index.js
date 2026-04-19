import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

import { publicFetch } from '../../../util/fetcher'

import { Spinner } from '../../icons'

import styles from './avatar-card.module.css'

const UserAvatar = ({ username }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await publicFetch.get(`/user/${username}`)
      setUserInfo(data)
    }

    fetchUser()
  }, [username])

  return (
    <div>
      <div className={styles.avatarCard}>
        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.avatar}>
            <Link href="/users/[username]" as={`/users/${username}`}>
              <a>
                <img
                  src={`https://secure.gravatar.com/avatar/${userInfo.id}?s=164&d=identicon`}
                  alt={username}
                />
              </a>
            </Link>
          </div>
        )}
        <h2 className={styles.username}>{username}</h2>
        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {userInfo.questionCount || 0}
                </span>
                <span className={styles.statLabel}>Questions</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  {userInfo.answerCount || 0}
                </span>
                <span className={styles.statLabel}>Answers</span>
              </div>
            </div>
            <div className={styles.created}>
              <p>
                Created:{' '}
                <span>
                  {formatDistanceToNowStrict(new Date(userInfo.created), {
                    addSuffix: true
                  })}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserAvatar
