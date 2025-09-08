import pickle


class Assistant:

    def complete_code(self, text: str, cursor_position: int):
        text = text[:cursor_position]+'<|fim_suffix|>'+text[cursor_position:]
        input_text = f'<|fim_prefix|>{text}<|fim_middle|>'

        system_message = 'You are a code completion assistant.'
        system_message += ' You can only return one line of code.'
        messages = [
            {'role': 'system', 'content': system_message},
            {'role': 'user', 'content': input_text}]

        result = self.predict(messages, 128).split('\n')
        if len(result) >= 3:
            result = result[1:-1]

        return '\n'.join(result)

    def predict(self, messages: list[dict], max_new_tokens: int = 128):
        text = self.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True)

        model_inputs = self.tokenizer(
            [text], return_tensors='pt').to(self.model.device)
        generated_ids = self.model.generate(
            model_inputs.input_ids,
            max_new_tokens=max_new_tokens)[0]

        return self.tokenizer.decode(
            generated_ids[len(model_inputs.input_ids[0]):],
            skip_special_tokens=True)

    def save(self, path: str):
        data = {
            'model_name': self.model_name,
            'model': self.model,
            'tokenizer': self.tokenizer}

        with open(path, 'wb') as file:
            pickle.dump(data, file, protocol=pickle.HIGHEST_PROTOCOL)

    def load(self, path: str):
        with open(path, 'rb') as file:
            data = pickle.load(file)
            self.model_name = data['model_name']
            self.model = data['model']
            self.tokenizer = data['tokenizer']
