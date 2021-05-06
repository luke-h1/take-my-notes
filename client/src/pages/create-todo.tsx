import { CustomHead } from 'components/CustomHead';
import { Form, Formik } from 'formik';
import { NextSeo } from 'next-seo';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Flex } from '../components/Flex';
import { InputField } from '../components/InputField';
import { useCreateTodoMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreateTodoPage: React.FC<{}> = () => {
  const router = useRouter();
  useIsAuth();
  const [, createTodo] = useCreateTodoMutation();
  return (
    <>
      <CustomHead
        title="Create todo | tmtodos.me"
        description="create a todo"
      />
      <NextSeo
        title="Create todo"
        canonical="https://tmtodos.me/create-todo"
        openGraph={{
          url: 'https://tmtodos.me/create-todo',
          title: 'create todo',
        }}
      />
      <Flex>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            const { error } = await createTodo({ input: values });
            if (!error) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                placeholder="title"
                label="title"
                data-testid="title"
              />
              <div className="mt-4 mb-4">
                <InputField
                  name="text"
                  placeholder="text"
                  label="body"
                  data-testid="body"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={isSubmitting}
              >
                Create Todo
              </button>
            </Form>
          )}
        </Formik>
      </Flex>
    </>
  );
};
export default withUrqlClient(createUrqlClient)(CreateTodoPage);
