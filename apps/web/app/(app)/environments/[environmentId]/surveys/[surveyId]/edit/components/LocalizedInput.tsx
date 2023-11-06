import { Input } from "@formbricks/ui/Input";
import LanguageIndicator from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/components/LanguageIndicator";

const LocalizedInput = ({
  id,
  name,
  value,
  isInValid,
  onChange,
  selectedLanguage,
  setSelectedLanguage,
  onBlur,
}) => {
  const hasi18n = value._i18n_;
  return (
    <div className="relative w-full">
      <Input
        id={id}
        isInvalid={isInValid && value[selectedLanguage].trim() === ""}
        name={name}
        value={value[selectedLanguage]}
        onChange={onChange}
        onBlur={onBlur}
      />
      {hasi18n && (
        <div>
          <LanguageIndicator selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          {selectedLanguage !== "default" && value.default && (
            <div className="mt-1 text-xs text-gray-500">
              <strong>Translate:</strong> {value.default}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalizedInput;