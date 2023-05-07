import type { Lists } from '.keystone/types';
import User from './src/list/User';
import Post from './src/list/Post';
import Tag from './src/list/Tag';
import Comment from './src/list/Comment';
import Reaction from './src/list/Reaction';
import Message from './src/list/Message';
import NewsletterSubscription from './src/list/NewsLetterSubscription';
import Form from './src/list/Form';
import Answer from './src/list/Answer';

export const lists: Lists = {
  Message,
  NewsletterSubscription,
  User,
  Post,
  Tag,
  Comment,
  Reaction,
  Form,
  Answer
};