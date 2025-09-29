import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CongratulationsModal = () => {
  const { state, setShowCongratulations } = useApp();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowCongratulations(false);
    navigate("/module");
  };

  return (
    <Dialog open={state.showCongratulations} onOpenChange={setShowCongratulations}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-2">
              <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
              <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
              <PartyPopper className="h-10 w-10 text-pink-500 animate-bounce delay-100" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Congratulations! 🎉
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold text-primary">
            Outstanding Achievement!
          </div>
          <p className="text-muted-foreground">
            You have successfully completed the <strong>Artificial Learning and Machine Learning</strong> module 
            with mastery in all learning objectives. Your dedication and hard work have paid off!
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🌟 You're now ready to advance to the next module in your learning journey!
            </p>
          </div>
          <Button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Continue Learning Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsModal;
