import { FC, ReactNode, useEffect, useState } from "react"
import { Text, TextInput, TouchableWithoutFeedback, View } from "react-native"

interface FormInputInterface {
  label?: string,
  placeholder: string,
  prefix?: ReactNode,
  sufix?: ReactNode,
  inputType?: "text" | "number",
  value: string,
  onChange: (value: string) => void,
  isBackground?: boolean
  customHeight?: number,
  msg?: string,
  onPres?: () => void,
  isRequired?: boolean
  isMultiLine?: boolean
  maxLength?: number | null
}

const FormInput: FC<FormInputInterface> = ({ label = "", placeholder, prefix = null, sufix = null, inputType = "text", value, onChange, isBackground = false, customHeight = 0, msg = "", onPres, isRequired, isMultiLine = false, maxLength = null }) => {
  const [numberOfLines, setNumberOfLine] = useState(0)

  useEffect(() => {

    if (value === "") {
      setNumberOfLine(0)
    }

  }, [value])

  return (
    <TouchableWithoutFeedback onPress={() => {
      onPres ? onPres() : ""
    }}>
      <View className="w-full">
        {
          label !== "" &&
          <View className="flex-row items-center">
            <Text className="text-sm text-black font-satoshi">{label}</Text>
            {
              isRequired &&
              <Text className="text-sm text-Primary/Main font-satoshi">
                *
              </Text>
            }
          </View>
        }

        <View style={{ minHeight: customHeight > 0 ? customHeight : numberOfLines > 48 ? numberOfLines > 100 ? 100 : numberOfLines : 48, maxHeight: 100 }} className={`w-full border border-gray-200 rounded-lg mt-2 items-center flex-row px-4 ${isBackground ? "bg-gray-100" : ""}`}>
          {
            prefix !== null &&
            <View className="justify-center items-start">
              {prefix}
            </View>
          }

          <View className="flex-1">
            <TextInput
              maxLength={maxLength !== null ? maxLength : 1000000}
              multiline={isMultiLine}
              onContentSizeChange={(e) => {
                if (isMultiLine) {
                  setNumberOfLine(e.nativeEvent.contentSize.height)
                }
              }}
              editable={onPres ? false : true}
              style={{ minHeight: customHeight > 0 ? customHeight : numberOfLines > 47 ? numberOfLines > 100 ? 100 : numberOfLines : 47, maxHeight: 100 }}
              className={`flex-1 font-satoshi text-black ${isBackground ? "bg-gray-100" : ""}`}
              placeholder={placeholder}
              placeholderTextColor="#757575"
              keyboardType={inputType === "number" ? "number-pad" : "default"}
              value={value}
              onChangeText={(value) => onChange(value)}
            />
          </View>

          {
            sufix !== null &&
            <View className="justify-center items-end">
              {sufix}
            </View>
          }
        </View>

        {
          msg !== "" &&
          <View className="mt-1">
            <Text className="font-satoshi text-xs text-Primary/Main">
              {msg}
            </Text>
          </View>
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export default FormInput