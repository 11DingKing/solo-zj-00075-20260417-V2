import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import { publicFetch } from '../../util/fetcher'

import Layout from '../../components/layout'
import UserCard from '../../components/user-card'
import AvatarCard from '../../components/user-card/avatar-card'
import PostList from '../../components/user-card/post-list'
import PostItem from '../../components/user-card/post-list/post-item'
import { Spinner } from '../../components/icons'

const UserDetail = ({ username }) => {
  const [posts, setPosts] = useState(null)
  const [postType, setPostType] = useState('Questions')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const endpoint =
          postType === 'Questions'
            ? `/question/user/${username}`
            : `/answer/user/${username}`
        const { data } = await publicFetch.get(endpoint)
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [postType, username])

  return (
    <Layout extra={false}>
      <Head>
        <title>Users {username} - Clone of Stackoverflow</title>
      </Head>

      <UserCard>
        <AvatarCard username={username} />
        <PostList postType={postType} setPostType={setPostType}>
          {loading && (
            <div className="loading">
              <Spinner />
            </div>
          )}

          {!loading && posts && postType === 'Questions' && posts.map(({ id, title, score, created }) => (
            <PostItem
              key={id}
              title={title}
              vote={score}
              created={created}
              id={id}
            />
          ))}

          {!loading && posts && postType === 'Answers' && posts.map(({ id, questionTitle, score, created, questionId, text }) => (
            <PostItem
              key={id}
              type="answer"
              questionTitle={questionTitle}
              vote={score}
              created={created}
              questionId={questionId}
              text={text}
            />
          ))}

          {!loading && posts?.length == 0 && (
            <p className="not-found-questions">
              {postType === 'Questions'
                ? `Don't have any questions yet.`
                : `Don't have any answers yet.`}
            </p>
          )}
        </PostList>
      </UserCard>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const username = context.params.username
  return {
    props: {
      username
    }
  }
}

export default UserDetail
