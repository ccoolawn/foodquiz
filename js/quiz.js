(function(){
	var app = angular.module('fdQuiz', []);

	app.controller('QuizController',['$scope','$http','$sce',function($scope,$http,$sce) {
		$scope.score = 0;
		$scope.activeQuestion = -1;
		$scope.activeQuestionAnswered = 0;
		$scope.percentage = 0;

		$http.get('https://api.myjson.com/bins/1lcht').then(function(quizData) {
			$scope.myQuestions = quizData.data;
			$scope.totalQuestions = $scope.myQuestions.length;
		});

		$scope.selectAnswer = function(qIndex,aIndex) {

			var questionState = $scope.myQuestions[qIndex].questionState;

			if (questionState != 'answered') {
				$scope.myQuestions[qIndex].selectAnswer = aIndex;
				var correctAnswer = $scope.myQuestions[qIndex].correct;
				$scope.myQuestions[qIndex].correctAnswer = correctAnswer;

				if (aIndex === correctAnswer) {
					$scope.myQuestions[qIndex].correctness = 'correct';
					$scope.score += 1;
				} else {
					$scope.myQuestions[qIndex].correctness = 'incorrect';
				}
				$scope.myQuestions[qIndex].questionState = 'answered'
			}
			$scope.percentage = (($scope.score / $scope.totalQuestions)*100).toFixed(1);
		};

		$scope.isSelected = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].selectAnswer === aIndex;
		},

		$scope.isCorrect = function(qIndex,aIndex){
			return $scope.myQuestions[qIndex].correctAnswer === aIndex;
		},

		$scope.selectContinue = function(){
			return $scope.activeQuestion += 1;
		},

		$scope.createShareLinks = function(percentage){
			var url = 'http://cornellcoulon.com';

			var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my quiz score!&amp;body=I scored a '+percentage+'% on this quiz about Food. Try to beat my score at '+url+'">Email a friend!</a>';

			var twitterLink = '<a class="btn twitter" target="_blank" href="http://twitter.com/share?text=I scored a '+percentage+'% on this quiz about Food. Try to beat my score at&amp;hashtags=FoodQuiz&amp;url='+url+'">Tweet your score!</a>';

			var newMarkup = emailLink + twitterLink;

			return $sce.trustAsHtml(newMarkup);
		};
	}]);
})();