"use client";

import {
  customSurvey,
  templates,
} from "@/app/(app)/environments/[environmentId]/surveys/templates/templates";
import ChurnImage from "@/images/onboarding-churn.png";
import FeedbackImage from "@/images/onboarding-collect-feedback.png";
import NPSImage from "@/images/onboarding-nps.png";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { TEnvironment } from "@formbricks/types/environment";
import { TTemplate } from "@formbricks/types/templates";
import { Button } from "@formbricks/ui/Button";
import { OptionCard } from "@formbricks/ui/OptionCard";

import { createSurveyFromTemplate } from "../actions";

interface OnboardingModalProps {
  environment: TEnvironment;
}

export function OnboardingModal({ environment }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const templateOrder = ["Collect Feedback", "Net Promoter Score (NPS)", "Churn Survey"];
  const templateImages = {
    "Collect Feedback": FeedbackImage,
    "Net Promoter Score (NPS)": NPSImage,
    "Churn Survey": ChurnImage,
  };
  const filteredTemplates = templates
    .filter((template) => templateOrder.includes(template.name))
    .sort((a, b) => templateOrder.indexOf(a.name) - templateOrder.indexOf(b.name));

  if (!isOpen) return null;

  const newSurveyFromTemplate = async (template: TTemplate) => {
    setLoadingTemplate(template.name);
    localStorage.removeItem("pathway");
    try {
      const survey = await createSurveyFromTemplate(template, environment);
      router.push(`/environments/${environment.id}/surveys/${survey.id}/edit`);
    } catch (e) {
      toast.error("An error occurred creating a new survey");
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950 bg-opacity-80 backdrop-blur-md">
      <div className="shadow-card-lg relative flex h-[85vh] w-[85vw] flex-col items-center justify-center rounded-xl bg-slate-50 p-10">
        <div className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md p-1 text-slate-400 hover:bg-slate-200">
          <X
            onClick={() => {
              localStorage.removeItem("pathway");
              setIsOpen(false);
            }}
          />
        </div>
        <div className="p-6">
          <div className="mb-8 flex items-end justify-between">
            <p className="text-2xl font-medium">Create your first survey</p>
            <Button
              size="lg"
              variant="darkCTA"
              loading={loadingTemplate === "Start from scratch"}
              onClick={() => {
                newSurveyFromTemplate(customSurvey);
              }}>
              Start from scratch <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 grid w-full grid-cols-3 grid-rows-1 gap-6">
            {filteredTemplates.map((template) => {
              const TemplateImage = templateImages[template.name];
              return (
                <OptionCard
                  size="sm"
                  key={template.name}
                  title={template.name}
                  description={template.description}
                  onSelect={() => newSurveyFromTemplate(template)}
                  loading={loadingTemplate === template.name}>
                  <Image
                    src={TemplateImage}
                    alt={template.name}
                    className="rounded-md border border-slate-300"
                  />
                </OptionCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
